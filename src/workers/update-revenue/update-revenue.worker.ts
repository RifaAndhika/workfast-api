import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import type { UpdateRevenuePayload } from "../../queues/queue-update-revenue";
import { updateRevenueProcessor } from "./update-revenue.processor";
import { updateRevenueQueue } from "../../queues/queue-update-revenue";

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
