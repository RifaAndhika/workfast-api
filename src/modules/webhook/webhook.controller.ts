import { Request, Response } from "express";
import { verifyXenditToken } from "./webhook.service";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/app-error";

export const webhookController = async (req: Request, res: Response) => {
  try {
    const callbackToken = req.headers["x-callback-token"] as string;
    const Isvalid = verifyXenditToken(callbackToken);
    if (!Isvalid) {
      return sendResponse(res, 401, "Unauthorized");
    }
    console.log("koneksi berhasil");
    console.log(req.body);
    return sendResponse(res, 200, "Success");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal server error");
  }
};
