import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export interface SendReceiptPayload {}

export const sendReceiptQueue = new Queue<SendReceiptPayload>("send-receipt", {
  connection,
});
