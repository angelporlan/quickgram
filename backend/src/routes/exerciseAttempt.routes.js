import { Router } from "express";
import { createExerciseAttempt, getExerciseAttemptById, getUserAttempts, getUserStats } from "../controllers/exerciseAttempt.controller.js";
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

router.get(
    "/attempts",
    authenticate,
    getUserAttempts
);

router.get(
    "/attempts/stats/global",
    authenticate,
    getUserStats
);

export default router;