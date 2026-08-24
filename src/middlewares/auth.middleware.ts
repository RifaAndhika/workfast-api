import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/auth.utils";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parts = authorizationHeader.split(" "); // mengubah string menjadi array dan menjadi 2 index
  // 2. Perbaikan logika: Error jika BUKAN Bearer atau format salah
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Authorization format must be Bearer [token]" });
  }

  const token = parts[1];

  // 3. Perbaikan logika: Error jika token KOSONG
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  const decoded = verifyToken(token);
  // TAMBAHKAN PENGECEKAN INI:
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = decoded;
  next();
}
