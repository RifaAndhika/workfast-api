import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import type { SendReceiptPayload } from "../../queues/queue-send-receipt";
import { sendReceiptProcessor } from "./send-receipt.processor";

export const sendReceiptWorker = new Worker<SendReceiptPayload>(
  "send-receipt",
  async (job) => {
    console.log(job.data);
    return sendReceiptProcessor(
      job.data.invoiceId,
      job.data.gatewayTransactionId,
      job.data.paidAmount,
    );
  },
  {
    connection,
  },
);

// Monitor event sukses dan gagal di terminal
sendReceiptWorker.on("completed", (job) => {
  console.log(`✅ Job Slack dengan ID ${job.id} selesai diproses.`);
});

sendReceiptWorker.on("failed", (job, err) => {
  console.error(
    `❌ Job Slack dengan ID ${job?.id} gagal dimasukkan ke Slack:`,
    err.message,
  );
});
