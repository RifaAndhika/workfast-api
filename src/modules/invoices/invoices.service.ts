import { prisma } from "../../lib/prisma";
import { schemaInvoice } from "./invoices.schema";
import { z } from "zod";

export type invoiceInput = z.infer<typeof schemaInvoice>;
export const createInvoiceInput = async (input: invoiceInput) => {
  const { clientId, productName, totalAmount, status, dueDate, createdAt } =
    input;

  const newInvoice = await prisma.invoice.create({
    data: {
      clientId,
      productName,
      totalAmount,
      status,
      // Tips: bungkus dengan new Date() untuk menghindari bug zona waktu server (UTC vs WIB)
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      createdAt: createdAt ? new Date(createdAt) : undefined,
    },
  });
  return newInvoice;
};
