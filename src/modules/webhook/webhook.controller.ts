import { Request, Response } from "express";
import { verifyXenditToken } from "./webhook.service";
import { sendResponse } from "../../utils/sendResponse";
import { processInvoiceWebhook } from "./webhook.service";

export const webhookController = async (req: Request, res: Response) => {
  try {
    const callbackToken = req.headers["x-callback-token"] as string;
    const Isvalid = verifyXenditToken(callbackToken);
    if (!Isvalid) {
      return sendResponse(res, 401, "Unauthorized");
    }

    await processInvoiceWebhook(req.body);
    console.log("Webhook processed and queued successfully");
    return sendResponse(res, 200, "Webhook processed and queued successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal server error");
  }
};
