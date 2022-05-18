import Rollbar from 'rollbar';
import dotenv from 'dotenv';
dotenv.config();
const rollbar = new Rollbar({
  accessToken:
    process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
  nodeSourceMaps: true,
});

export default rollbar;