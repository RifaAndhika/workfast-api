import { connection } from "../../lib/redis";
import { resend } from "../../lib/resend";
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../utils/sendResponse";
import { Response } from "express";

export const sendReceiptProcessor = async (
  invoiceId: string,
  paidAmount: number,
) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true },
    });
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: `${invoice?.client?.email}`,
      subject: "Your Receipt Testing",
      html: `<p>Thank you for your payment of $${paidAmount} for invoice ${invoiceId} , product name ${invoice?.productName},
     total amount ${invoice?.totalAmount}, 
     payment status ${invoice?.status}
      from ${invoice?.client?.name} $(${invoice?.client?.email}).</p>`,
    });
    console.log("Email sent successfully:", emailResponse);
    return emailResponse;
  } catch (error) {
    sendResponse(
      {} as Response,
      500,
      "Failed to send receipt email. Please check the logs for more details.",
      error,
    );
  }
};
