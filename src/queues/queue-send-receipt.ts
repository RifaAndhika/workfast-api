import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export interface SendReceiptPayload {
  invoiceId: string;

  paidAmount: number;
}

export const sendReceiptQueue = new Queue<SendReceiptPayload>("send-receipt", {
  connection,
  defaultJobOptions: {
    //max retry
    attempts: 3,
    //jeda antar retry
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});
