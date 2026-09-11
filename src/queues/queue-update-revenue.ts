import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export interface UpdateRevenuePayload {
  invoiceId: string;
  gatewayTransactionId: string;
  paidAmount: number;
}
export const updateRevenueQueue = new Queue<UpdateRevenuePayload>(
  "update-revenue",
  {
    connection,
  },
);
