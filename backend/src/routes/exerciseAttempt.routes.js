import { Router } from "express";
import { createExerciseAttempt } from "../controllers/exerciseAttempt.controller.js";

const router = Router();

router.post("/exercises/:id/attempt", createExerciseAttempt);

export default router;
