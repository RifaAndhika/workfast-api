import { connection } from "../../lib/redis";
import { resend } from "../../lib/resend";
import { prisma } from "../../lib/prisma";

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

    const recipientEmail =
      process.env.NODE_ENV === "production"
        ? invoice.client?.email
        : "rifaandhika9@gmail.com";

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipientEmail,
      subject: "Your Receipt Testing",
      html: `<p>Thank you for your payment of $${paidAmount} for invoice ${invoiceId} , product name ${invoice?.productName},
     total amount ${invoice?.totalAmount}, 
     payment status ${invoice?.status}
      from ${invoice?.client?.name} $(${invoice?.client?.email}).</p>`,
    });
    console.log("Email sent successfully:", emailResponse);
    return emailResponse;
  } catch (error) {
    // Cetak error asli ke terminal agar tahu alasan pastinya jika gagal
    console.error(
      `[Worker Error] Failed to send receipt for invoice ${invoiceId}:`,
      error,
    );
    throw new Error(`Failed to send receipt for invoice ${invoiceId}`);
  }
};
