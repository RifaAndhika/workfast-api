import { z } from "zod";

export const schemaXenditPayload = z.object({
  event: z.string(),
  data: z.object({
    id: z.string(),
    external_id: z.string(),
    status: z.string(),
    paid_amount: z.number(),
  }),
});
