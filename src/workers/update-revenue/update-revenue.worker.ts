import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import type { UpdateRevenuePayload } from "../../queues/update-revenue.queue";
import { updateRevenueProcessor } from "./update-revenue.processor";

export const updateRevenueWorker = new Worker<UpdateRevenuePayload>(
  "update-revenue",
  async (job) => {
    console.log(job.data);
    return updateRevenueProcessor(
      job.data.invoiceId,
      job.data.gatewayTransactionId,
      job.data.paidAmount,
    );
  },
  {
    connection,
  },
);
