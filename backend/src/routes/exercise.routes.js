import express from "express";
import { getExercises } from "../controllers/exercise.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/exercises", authenticate, getExercises);

export default router;
