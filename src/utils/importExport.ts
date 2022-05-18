import Busboy from 'busboy';
import ApiResponse from './response';
import AWS from 'aws-sdk';
import { AdminDBService } from '../app/crm/modules/admin';
import sendToSQS from '../services/document/sendToSQS';

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID || 'AKIA6KPKNIC3KSSENZXJ',
  secretAccessKey:
    process.env.SECRET_ACCESS_KEY ||
    '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',
  region: process.env.REGION || 'us-east-2',
});

let MIN_BUFFER_SIZE = 5 * 1024 * 1024;

const createMultipartUpload = async (fileName) => {
  const params = {
    Bucket: process.env.S3_CRM_BUCKET_NAME,
    Key: `imports/${fileName}`,
  };

  const res = await s3.createMultipartUpload(params).promise();
  return res;
};

const getUploadedFileStatus = async (fileName, uploadId) => {
  const params = {
    Bucket: process.env.S3_CRM_BUCKET_NAME,
    Key: `imports/${fileName}`,
    UploadId: uploadId,
  };

  const res = await s3.listParts(params).promise();
  const totalSize = res.Parts.reduce((acc, part) => acc + part.Size, 0);
  return { size: totalSize, partsLength: res.Parts.length, parts: res.Parts };
};

const completeMultipartUpload = async (fileName, uploadId) => {
  const result = await getUploadedFileStatus(fileName, uploadId);
  const parts = result.parts.map((part) => ({
    ETag: part.ETag,
    PartNumber: part.PartNumber,
  }));

  const params = {
    Bucket: process.env.S3_CRM_BUCKET_NAME,
    Key: `imports/${fileName}`,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  const res = await s3.completeMultipartUpload(params).promise();
  return res;
};

const uploadChunkPart = async (fileName, partNumber, uploadId, partStream) => {
  const params = {
    Bucket: process.env.S3_CRM_BUCKET_NAME,
    Key: `imports/${fileName}`,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: partStream,
  };

  const res = await s3.uploadPart(params).promise();
  return res;
};

export const uploadRequest = async (
  res,
  { fileName, tagId, fileLength },
  admin,
) => {
  try {
    const response = await createMultipartUpload(fileName);
    const importPayload = {
      fileName,
      uploadId: response.UploadId,
      key: 'imports/' + fileName,
      meta: {
        multiPartCreatedRes: response,
        tagId,
        fileLength,
        parts: [],
      },
    };

    const newDoc = await AdminDBService.createImportRecord(
      admin.id,
      importPayload,
    );

    return ApiResponse.success(res, 200, '', { ...response, fileName });
  } catch (err) {
    console.log('request-error =>', err);
    throw err;
  }
};

export const importFiles = async (req, res) => {
  const contentRange = req.headers['content-range'];
  const uploadId = req.headers['upload-id'];
  const match = contentRange.match(/bytes=(\d+)-(\d+)\/(\d+)/);

  if (!match) {
    return ApiResponse.error(res, 400, 'Invalid "content-range" Format');
  }

  const rangeStart = Number(match[1]);
  const rangeEnd = Number(match[2]);
  const fileSize = Number(match[3]);

  if (rangeStart >= fileSize || rangeStart >= rangeEnd || rangeEnd > fileSize) {
    return ApiResponse.error(res, 400, 'Invalid "content-range" Provided');
  }

  const busboy = Busboy({ headers: req.headers });

  busboy.on('error', (err) => {
    console.log(err);
    return ApiResponse.error(res, 500, 'Bad "chunk" provided');
  });

  busboy.on('close', () => {
    return ApiResponse.success(res, 200, '');
  });

  let bufferSize = 0;
  let completedSize = 0;
  let count = 1;

  busboy.on('file', (_, file, info) => {
    const { filename } = info;

    if (!uploadId) {
      req.pause();
    }

    const chunks = [];
    file.on('data', async (data) => {
      bufferSize += data.length;
      chunks.push(data);

      // make sure the remaining bytes of the file is going to match the min buffer size

      const remaingBytes = fileSize - completedSize;
      const nextRemainingBytes = remaingBytes - bufferSize;
      // upload to s3
      if (
        bufferSize >= MIN_BUFFER_SIZE &&
        nextRemainingBytes > MIN_BUFFER_SIZE
      ) {
        console.log('uploading chunk', count, 'with size', bufferSize);
        const buffer = Buffer.concat(chunks);
        // pause and resume the file stream
        file.pause();
        completedSize += buffer.length;
        const uploadResult = await uploadChunkPart(
          filename,
          count,
          uploadId,
          buffer,
        );
        console.log('uploaded part', uploadResult);
        const currentDocument = await AdminDBService.getImportFileWithUploadId(
          uploadId,
        );
        const oldParts = currentDocument?.meta?.parts || [];
        const newParts = [...oldParts, uploadResult];
        const updatedmeta = {
          ...(currentDocument?.meta || {}),
          parts: newParts,
          completedSize,
          fileSize,
        };

        await currentDocument?.update({ meta: updatedmeta });

        bufferSize = 0;
        chunks.length = 0;
        count++;
        file.resume();
      }
    });

    file.on('end', async () => {
      // send in remaining bytes
      const currentDocument = await AdminDBService.getImportFileWithUploadId(
        uploadId,
      );
      if (bufferSize > 0) {
        console.log('uploading remaining bytes', bufferSize);
        const buffer = Buffer.concat(chunks);
        const uploadResult = await uploadChunkPart(
          filename,
          count,
          uploadId,
          buffer,
        );

        // update progress ond db

        const oldParts = currentDocument?.meta?.parts || [];
        const newParts = [...oldParts, uploadResult];
        const updatedmeta = {
          ...(currentDocument?.meta || {}),
          parts: newParts,
          completedSize,
          fileSize,
        };

        await currentDocument?.update({ meta: updatedmeta });

        completedSize += buffer.length;
        console.log('finish', { completedSize, fileSize, bufferSize });

        const completedResult = await completeMultipartUpload(
          filename,
          uploadId,
        );

        console.log('uploaded file', completedResult);
        await currentDocument.reload();

        await currentDocument.update({
          status: 'UPLOAD_TO_S3_COMPLETED',
          documentUrl: completedResult.Location,
          meta: {
            ...(currentDocument?.meta || {}),
            completedSize,
            completeUploadMeta: completedResult,
          },
        });
        bufferSize = 0;
        chunks.length = 0;
        count++;
      }

      // complete upload
      if (completedSize === fileSize) {
        console.log('upload complete', { completedSize, fileSize, bufferSize });
        // send record to queue
        await currentDocument.reload();
        await sendToSQS(currentDocument?.dataValues || {}, 'import_queue');
        res.status(200).json({ message: 'Uploaded Successfully' });
      }
    });
  });

  req.pipe(busboy);
};

export const getSignedDocUrl = async (key: string) => {
  const s3Params = {
    Bucket: process.env.S3_CRM_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60 * 1,
  };

  const signedUrl = await s3.getSignedUrl('getObject', s3Params);
  return signedUrl;
};
