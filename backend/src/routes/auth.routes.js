import { Router } from "express";
import { login, register, googleLogin, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/auth/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
