import { Router } from "express";
import { webhookController } from "./webhook.controller";
const router = Router();

router.post("/", webhookController);

export const webhookRoute = router;
