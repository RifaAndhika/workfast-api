import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import type { SendReceiptPayload } from "../../queues/queue-send-receipt";
import { sendReceiptProcessor } from "./send-receipt.processor";

export const sendReceiptWorker = new Worker<SendReceiptPayload>(
  "send-receipt",
  async (job) => {
    console.log(job.data);
    return sendReceiptProcessor(job.data.invoiceId, job.data.paidAmount);
  },
  {
    connection,
  },
);
