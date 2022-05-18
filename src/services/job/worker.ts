import Cron from "cron";
import logger from "../../utils/logger";
import manageSplitPayment from "./managePaymentSplit";

const job = new Cron.CronJob(
  "*/15 * * * *",
  () => {
    manageSplitPayment();
  },
  null,
  true,
  "America/Los_Angeles"
);


const startJob = () => {
  // showConfiguration();
  logger("Cron Job Payment Split Manager starting ...");
  console.log("Cron Job Payment Split Manager starting ...");
  job.start();
}

export default startJob;
