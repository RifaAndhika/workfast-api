import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import { generateMonthlyRevenueReport } from "./monthly-report.scheduler";

export const monthlyReportWorker = new Worker(
  "monthly-report",
  async (job) => {
    console.log(job.data, "monthly-report");
    return generateMonthlyRevenueReport();
  },

  {
    connection,
  },
);
