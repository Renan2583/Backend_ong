import { Router } from "express";
import { loginController, meController, verifyToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginController);
router.get("/me", verifyToken, meController);

export default router;