import express, { Request } from "express";
import { authRoute } from "./modules/auth/auth.route";
import { webhookRoute } from "./modules/webhook/webhook.route";

const app = express();
app.use(express.json({}));

app.use("/webhook", webhookRoute);
app.use("/auth", authRoute);

export default app;
