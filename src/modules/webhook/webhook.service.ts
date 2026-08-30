import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export function verifyXenditToken(receivedToken: string): boolean {
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;

  // console.log("DEBUG - received:", JSON.stringify(receivedToken));
  // console.log("DEBUG - expected:", JSON.stringify(expectedToken));
  // console.log("DEBUG - received length:", receivedToken?.length);
  // console.log("DEBUG - expected length:", expectedToken?.length);
  if (!receivedToken || !expectedToken) {
    return false;
  }

  const receivedBuffer = Buffer.from(receivedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  // Menggunakan crypto.timingSafeEqual untuk bawaan Node.js memastikan bahwa komputer membutuhkan waktu yang sama
  //  persis untuk mengecek token tersebut, entah kodenya benar ataupun salah, sehingga penyerang tidak bisa menebak isi token
  //  Anda.
  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}
