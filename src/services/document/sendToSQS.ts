import getAWSConfig from "../../utils/awsConfig";

interface IAvailableQueueObj {
  [key: string]: (inp: string) => {
    MessageAttributes: any;
    MessageBody: string;
    MessageDeduplicationId: string;
    MessageGroupId: string;
    QueueUrl: string;
  };
}

const AWS = getAWSConfig();

const queues: IAvailableQueueObj = {
  export_queue: (stringified) => ({
    // Remove DelaySeconds parameter and value for FIFO queues
    MessageAttributes: {
      Title: {
        DataType: "String",
        StringValue: `EXPORT`,
      },
      Author: {
        DataType: "String",
        StringValue: "QuikInfluence",
      },
      WeeksOn: {
        DataType: "Number",
        StringValue: "6",
      },
    },
    MessageBody: stringified,
    MessageDeduplicationId: `RANDID${Date.now()}`, // Required for FIFO queues
    MessageGroupId: `EXPORT_QUEUE`, // Required for FIFO queues
    QueueUrl: process.env.EXPORT_QUEUE_URL || "",
  }),
  import_queue: (stringified) => ({
    // Remove DelaySeconds parameter and value for FIFO queues
    MessageAttributes: {
      Title: {
        DataType: "String",
        StringValue: `IMPORT`,
      },
      Author: {
        DataType: "String",
        StringValue: "QuikInfluence",
      },
      WeeksOn: {
        DataType: "Number",
        StringValue: "6",
      },
    },
    MessageBody: stringified,
    MessageDeduplicationId: `RANDID${Date.now()}`, // Required for FIFO queues
    MessageGroupId: `IMPORT_QUEUE`, // Required for FIFO queues
    QueueUrl: process.env.IMPORT_QUEUE_URL || "",
  }),
};

const sqs = new AWS.SQS({
  apiVersion: "2012-11-05",
});

const sendToSQS = async (data: any, name: string) => {
  const stringified = JSON.stringify(data);

  const params = queues[name](stringified);

  const push_to_queue = () =>
    new Promise((res, rej) => {
      console.log("queue message starting", params);
      sqs.sendMessage(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          rej(err);
        } else {
          console.log("Success", data.MessageId);
          res(data);
        }
        return;
      });
    });

  await push_to_queue();
};

export default sendToSQS;
