import { Router } from "express";
import { createExerciseAttempt, getExerciseAttemptById } from "../controllers/exerciseAttempt.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/exercises/:id/attempt",
    authenticate,
    createExerciseAttempt
);

router.get(
    "/attempts/:id",
    authenticate,
    getExerciseAttemptById
);

export default router;