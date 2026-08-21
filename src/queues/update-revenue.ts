import { Queue } from "bullmq";
import { connection } from "../lib/redis";

export interface UpdateRevenuePayload {
  invoiceId: string;
  gatewayTransactionId: string;
  amount: number;
}
export const invoiceQueue = new Queue<UpdateRevenuePayload>("update-revenue", {
  connection,
});
