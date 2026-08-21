import { Redis } from "ioredis";
import dotenv from "dotenv";

export const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
