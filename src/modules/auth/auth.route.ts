import { Router } from "express";
import { loginController } from "./auth.controller";

const router = Router();

router.post("/login", loginController);

export default router; // Pastikan di-export agar bisa dipakai di server.ts/app.ts
