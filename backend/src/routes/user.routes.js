import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getUserProgress } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users/me/progress", authenticate, getUserProgress);

export default router;
