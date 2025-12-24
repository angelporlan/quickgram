import express from "express";
import { createSessionPremium, createSessionPro } from "../controllers/payments.controller.js";

const router = express.Router();

router.post("/create-checkout-session-premium", createSessionPremium);
router.post("/create-checkout-session-pro", createSessionPro);

export default router;