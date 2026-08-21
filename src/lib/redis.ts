import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();
export const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("🚀 Sukses: Terhubung ke Upstash Redis!");
});

connection.on("error", (err) => {
  console.error("❌ Gagal konek ke Redis:", err.message);
});
