import { Request, Response } from "express";
import { loginService } from "./auth.service";
import { AppError } from "../../utils/app-error";
import { schemaAuth } from "./auth.schema";

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
    return res.status(200).json({ success: true, token: accessToken });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
