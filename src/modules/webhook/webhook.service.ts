import crypto from "crypto";
import dotenv from "dotenv";
import { updateRevenueQueue } from "../../queues/update-revenue.queue";

dotenv.config();

export function verifyXenditToken(receivedToken: string): boolean {
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;

  if (!receivedToken || !expectedToken) {
    return false;
  }

  const receivedBuffer = Buffer.from(receivedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  // Menggunakan crypto.timingSafeEqual untuk bawaan Node.js memastikan bahwa komputer membutuhkan waktu yang sama
  //  persis untuk mengecek token tersebut, entah kodenya benar ataupun salah, sehingga penyerang tidak bisa menebak isi token
  //  Anda.
  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

export interface XenditInvoicePayload {
  event: string;
  data: {
    id: string;
    external_id: string;
    status: string;
    paid_amount: number;
  };
}

export async function processInvoiceWebhook(payload: XenditInvoicePayload) {
  const invoiceStatus = payload.data.status;

  if (invoiceStatus !== "PAID") {
    return;
  }

  await updateRevenueQueue.add("update_revnue", {
    invoiceId: payload.data.external_id,
    gatewayTransactionId: payload.data.id,
    paidAmount: payload.data.paid_amount,
  });
}
