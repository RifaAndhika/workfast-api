import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { Prisma } from "../../generated/prisma/client";
export const updateRevenueProcessor = async (
  invoiceId: string,
  gatewayTransactionId: string,
  paidAmount: number,
) => {
  const exsistingGatewayTransactionId = await prisma.payment.findUnique({
    where: { idempotencyKey: gatewayTransactionId },
    select: { gatewayTransactionId: true },
  });

  if (exsistingGatewayTransactionId) {
    console.log(
      `Payment with gatewayTransactionId ${gatewayTransactionId} has already been processed. Skipping update.`,
    );
    return;
  }
  try {
    const [newPayment, newRevenue, updatedInvoice] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          invoiceId,
          idempotencyKey: gatewayTransactionId,
          gatewayTransactionId,
          status: "SUCCESS",
        },
      }),
      prisma.revenueEntry.create({
        data: {
          invoiceId,
          amount: paidAmount,
        },
      }),
      prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID" },
      }),
    ]);
    return { newPayment, newRevenue, updatedInvoice };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log(
        `[Idempotency-Trigger] Race condition prevented. Transaction ${gatewayTransactionId} already processed.`,
      );
      return;
    }

    console.error(
      `Error occurred while updating revenue for invoiceId ${invoiceId}:`,
      error,
    );
    throw new AppError(
      "Failed to update revenue. Please check the logs for more details.",
      500,
    );
  }
};
