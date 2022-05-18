import * as AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
const getAWSConfig = () => {
  AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });
  return AWS;
};

export default getAWSConfig;
