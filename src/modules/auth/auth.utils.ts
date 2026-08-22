import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10; // kenapa 10 karena standar industri dan tidak membuat server dan ux yang terlalu berat

export async function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function generteToken(payload: JwtPayload): Promise<string> {
  return await jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}
