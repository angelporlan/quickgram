import express from "express";
import { getExercises } from "../controllers/exercise.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getCategories } from "../controllers/exercise.controller.js";
import { getSubcategories } from "../controllers/exercise.controller.js";

const router = express.Router();

router.get("/exercises", authenticate, getExercises);
router.get("/categories", authenticate, getCategories);
router.get("/subcategories", authenticate, getSubcategories);

export default router;
