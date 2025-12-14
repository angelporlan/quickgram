import { UserExerciseAttempt } from "../models/UserExerciseAttempt.js";
import { Exercise } from "../models/Exercise.js";
import { Subcategory } from "../models/Subcategory.js";
import { Category } from "../models/Category.js";
import { Level } from "../models/Level.js";
import { Sequelize } from "sequelize";

export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalAttempts = await UserExerciseAttempt.count({
            where: { user_id: userId }
        });

        const totalCorrect = await UserExerciseAttempt.count({
            where: {
                user_id: userId,
                is_fully_correct: true
            }
        });

        const globalScore = totalAttempts
            ? (totalCorrect / totalAttempts)
            : 0;

        const progressByCategory = await UserExerciseAttempt.findAll({
            where: { user_id: userId },
            attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("UserExerciseAttempt.id")), "attempts"],
                [Sequelize.fn("SUM", Sequelize.col("correct_gaps")), "correct"]
            ],
            include: {
                model: Exercise,
                attributes: [],
                include: {
                    model: Subcategory,
                    attributes: [],
                    include: {
                        model: Category,
                        attributes: ["id", "name"]
                    }
                }
            },
            group: ["Exercise.Subcategory.Category.id"]
        });

        const progressByLevel = await UserExerciseAttempt.findAll({
            where: { user_id: userId },
            attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("UserExerciseAttempt.id")), "attempts"],
                [Sequelize.fn("SUM", Sequelize.col("correct_gaps")), "correct"]
            ],
            include: {
                model: Exercise,
                attributes: [],
                include: {
                    model: Level,
                    attributes: ["id", "name"]
                }
            },
            group: ["Exercise.Level.id"]
        });

        const lastAttempts = await UserExerciseAttempt.findAll({
            where: { user_id: userId },
            order: [["created_at", "DESC"]],
            limit: 10,
            include: {
                model: Exercise,
                attributes: ["id", "type"]
            }
        });

        res.json({
            global: {
                attempts: totalAttempts,
                correct: totalCorrect,
                score: Number(globalScore.toFixed(2))
            },
            byCategory: progressByCategory,
            byLevel: progressByLevel,
            lastAttempts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting user progress" });
    }
};
