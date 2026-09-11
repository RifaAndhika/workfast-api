import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export interface SendReceiptPayload {
  invoiceId: string;
  paidAmount: number;
}

export const sendReceiptQueue = new Queue<SendReceiptPayload>("send-receipt", {
  connection,
});
