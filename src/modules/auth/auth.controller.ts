import { Request, Response } from "express";
import { loginService } from "./auth.service";
import { AppError } from "../../utils/app-error";
import { schemaAuth } from "./auth.schema";
import { sendResponse } from "../../utils/sendResponse";

export const loginController = async function (req: Request, res: Response) {
  const payload = schemaAuth.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "email or password is required" });
  }
  try {
    const accessToken = await loginService(
      payload.data.email,
      payload.data.password,
    );
    return sendResponse(res, 200, "Login success", { accessToken });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Internal server error");
  }
};
