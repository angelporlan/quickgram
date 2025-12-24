import express from "express";
import { createSessionPremium, createSessionPro } from "../controllers/payments.controller.js";

const router = express.Router();

router.get("/create-checkout-session-premium", createSessionPremium);
router.get("/create-checkout-session-pro", createSessionPro);

export default router;