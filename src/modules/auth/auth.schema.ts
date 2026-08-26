import { z } from "zod";

export const schemaAuth = z.object({
  email: z.email(),
  password: z.string().min(8),
});
