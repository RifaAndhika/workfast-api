import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export interface NotifySlackPayload {
  invoiceId: string;

  paidAmount: number;
}

export const notifySlackQueue = new Queue<NotifySlackPayload>("notify-slack", {
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
