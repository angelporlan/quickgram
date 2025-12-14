import { Router } from "express";
import { createExerciseAttempt } from "../controllers/exerciseAttempt.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/exercises/:id/attempt",
    authenticate,
    createExerciseAttempt
);

export default router;