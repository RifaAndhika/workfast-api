import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import type { UpdateRevenuePayload } from "../../queues/update-revenue.queue";

export const updateRevenueWorker = new Worker<UpdateRevenuePayload>(
  "update-revenue",
  async (job) => {
    console.log(job.data);
  },
  {
    connection,
  },
);
