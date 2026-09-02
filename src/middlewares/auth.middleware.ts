import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/auth.utils";
import { sendResponse } from "../utils/sendResponse";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return sendResponse(res, 401, "Unauthorized");
  }

  const parts = authorizationHeader.split(" "); // mengubah string menjadi array dan menjadi 2 index
  // 2. Perbaikan logika: Error jika BUKAN Bearer atau format salah
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return sendResponse(
      res,
      401,
      "Authorization format must be Bearer [token]",
    );
  }

  const token = parts[1];

  // 3. Perbaikan logika: Error jika token KOSONG
  if (!token) {
    return sendResponse(res, 401, "Token is missing");
  }

  const decoded = verifyToken(token); // memanggil fungsi verifyToken dan mengembalikan nilai decoded yang sudah diverify
  // TAMBAHKAN PENGECEKAN INI:
  if (!decoded) {
    return sendResponse(res, 401, "Invalid or expired token");
  }

  req.user = decoded;
  next();
}
