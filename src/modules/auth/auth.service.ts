import { comparePassword, generateToken } from "./auth.utils";
import { AppError } from "../../utils/app-error";
import { prisma } from "../../lib/prisma";

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Email or password is incorrect", 401);

  const comparePasswordResult = await comparePassword(
    password,
    user.passwordHash,
  );
  if (!comparePasswordResult) {
    throw new AppError("Email or password is incorrect", 401);
  }

  const token = await generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return token;
};
