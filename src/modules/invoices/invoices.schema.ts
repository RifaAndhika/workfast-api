import { z } from "zod";

export const schemaInvoice = z.object({
  clientId: z.string(),
  productName: z.string(),
  totalAmount: z.number(),
  status: z.enum(["PENDING", "PAID", "EXPIRED", "CANCELLED"]),
  dueDate: z.date(),
  createdAt: z.date(),
  payments: z.array(z.object({})),
});
