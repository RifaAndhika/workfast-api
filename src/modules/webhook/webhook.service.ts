import crypto from "crypto";
import dotenv from "dotenv";
import { updateRevenueQueue } from "../../queues/update-revenue.queue";
import { schemaWebhook } from "./webhook.schema";
import { z } from "zod";

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

export type XenditInvoicePayload = z.infer<typeof schemaWebhook>;

export async function processInvoiceWebhook(payload: XenditInvoicePayload) {
  // 1. Cek tipe event-nya dulu. Jika bukan "invoice.paid", langsung hentikan proses.
  if (payload.event !== "invoice.paid") {
    console.log(`Event ${payload.event} diabaikan.`);
    return;
  }
  const invoiceStatus = payload.data.status;

  if (invoiceStatus !== "PAID") {
    return;
  }

  await updateRevenueQueue.add("update_revenue", {
    invoiceId: payload.data.external_id,
    gatewayTransactionId: payload.data.id,
    paidAmount: payload.data.paid_amount,
  });
}
