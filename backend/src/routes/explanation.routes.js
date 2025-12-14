import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { explainAttempt } from "../controllers/explanation.controller.js";

const router = express.Router();

router.post("/attempts/:id/explain", authenticate, explainAttempt);

export default router;