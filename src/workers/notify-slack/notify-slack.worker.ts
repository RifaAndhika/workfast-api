import { connection } from "../../lib/redis";
import { Worker } from "bullmq";
import type { NotifySlackPayload } from "../../queues/queue-notify-slack";
import { notifySlackProcessor } from "./notify-slack.processor";

export const notifySlackWorker = new Worker<NotifySlackPayload>(
  "notify-slack", // Harus sama persis dengan nama di Queue file
  async (job) => {
    console.log("🔥 Worker notify-slack menerima data:", job.data);
    return notifySlackProcessor(job.data.invoiceId, job.data.paidAmount);
  },
  {
    connection,
  },
);

// Monitor event sukses dan gagal di terminal
notifySlackWorker.on("completed", (job) => {
  console.log(`✅ Job Slack dengan ID ${job.id} selesai diproses.`);
});

notifySlackWorker.on("failed", (job, err) => {
  console.error(
    `❌ Job Slack dengan ID ${job?.id} gagal dimasukkan ke Slack:`,
    err.message,
  );
});
