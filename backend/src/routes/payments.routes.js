import express from "express";
import { createSessionPremium, createSessionPro, verifySession } from "../controllers/payments.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session-premium", authenticate, createSessionPremium);
router.post("/create-checkout-session-pro", authenticate, createSessionPro);
router.post("/payments/verify-session", verifySession);

export default router;