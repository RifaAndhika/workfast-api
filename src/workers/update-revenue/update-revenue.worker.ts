import { connection } from "../../lib/redis";
import { Worker, Queue } from "bullmq";
import type { UpdateRevenuePayload } from "../../queues/queue-update-revenue";
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

const sendSlackFailureAlert = async (
  jobId: string,
  errMsg: string,
  jobData: any,
) => {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    console.error("❌ SLACK_WEBHOOK_URL belum dikonfigurasi di env!");
    return;
  }

  const slackMessage = {
    text: `🚨 *CRITICAL: Antrean Gagal Permanen (Workfast)* 🚨`,
    attachments: [
      {
        color: "#FF0000",
        fields: [
          { title: "Nama Queue", value: "update-revenue", short: true },
          { title: "ID Job", value: jobId, short: true },
          {
            title: "Pesan Error",
            value: `\`\`\`${errMsg}\`\`\``,
            short: false,
          },
          {
            title: "Data Payload",
            value: `\`\`\`${JSON.stringify(jobData, null, 2)}\`\`\``,
            short: false,
          },
        ],
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  try {
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      console.error(`[Slack Alert Error] Status API: ${response.status}`);
    } else {
      console.log(
        `📢 Berhasil mengirim notifikasi kegagalan Job ${jobId} ke Slack!`,
      );
    }
  } catch (error) {
    console.error("❌ Gagal menembak API Slack Webhook:", error);
  }
};

// ==========================================
// 4. EVENT LISTENER UNTUK KEGAGALAN
// ==========================================
updateRevenueWorker.on("failed", async (job, err) => {
  const maxAttempts = job?.opts?.attempts || 3;
  const attemptsMade = job?.attemptsMade || 0;

  console.error(
    `⚠️ [update-revenue] Job ${job?.id} gagal pada percobaan ke-${attemptsMade}/${maxAttempts}: ${err.message}`,
  );

  if (attemptsMade === maxAttempts) {
    console.error(
      `🚨 Job ${job?.id} dinyatakan mati permanen. Memicu alert Slack...`,
    );
    await sendSlackFailureAlert(
      job?.id || "UNKNOWN",
      err.message,
      job?.data || {},
    );
  }
});
