import express from "express";
import { authRoute } from "./modules/auth/auth.route";

const app = express();
app.use(express.json());
app.use("/auth", authRoute);

export default app;
