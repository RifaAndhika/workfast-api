import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export const queueMonthlyReport = new Queue("monthly-report", {
  connection,
  defaultJobOptions: {
    //max retry
    attempts: 3,
    //jeda antar retry
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});
