import { prisma } from "../../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

export const notifySlackProcessor = async (
  invoiceId: string,
  paidAmount: number,
) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true },
    });

    if (!invoice) {
      console.error(`Invoice with ID ${invoiceId} not found`);
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.error(
        "SLACK_WEBHOOK_URL is not defined in the environment variables",
      );
      throw new Error(
        "SLACK_WEBHOOK_URL is not defined in the environment variables",
      );
    }

    const slackMessage = {
      text: `🔔 *Notifikasi Pendapatan Baru (Workfast)* 🔔`,
      attachments: [
        {
          color: "#2eb886", // Warna garis vertikal hijau (sukses)
          fields: [
            {
              title: "Nama Klien",
              value: invoice?.client?.name || "Tanpa Nama",
              short: true,
            },
            { title: "Produk", value: invoice.productName, short: true },
            { title: "ID Invoice", value: invoice.id, short: false },
            {
              title: "Uang Masuk (Xendit)",
              value: `Rp ${paidAmount.toLocaleString("id-ID")}`,
              short: true,
            },
            {
              title: "Total Tagihan",
              value: `Rp ${Number(invoice.totalAmount).toLocaleString("id-ID")}`,
              short: true,
            },
          ],
          ts: Math.floor(Date.now() / 1000), // Timestamp waktu sekarang
        },
      ],
    };
    // 5. Tembak Slack API menggunakan fetch bawaan Node.js (Stateless HTTP)
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      throw new Error(`Slack API merespons dengan status: ${response.status}`);
    }

    console.log(
      `[Slack Worker] Berhasil mengirimkan notifikasi untuk invoice ${invoice.id} 🚀`,
    );
    return { success: true };
  } catch (error) {
    console.error(
      `[Slack Worker Error] Gagal memproses notifikasi untuk invoice ${invoiceId}:`,
      error,
    );
    // Wajib throw error ke atas supaya BullMQ tahu kalau job ini harus di-retry
    throw error;
  }
};
