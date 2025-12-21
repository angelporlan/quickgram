import { UserExerciseAttempt } from "../models/UserExerciseAttempt.js";
import { Exercise } from "../models/Exercise.js";
import { Subcategory } from "../models/Subcategory.js";
import { AttemptExplanation } from "../models/AttemptExplanation.js";
import { Level } from "../models/Level.js";
import { Category } from "../models/Category.js";

export const createExerciseAttempt = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id: exerciseId } = req.params;

        const {
            user_answer,
            total_gaps,
            correct_gaps,
            is_fully_correct,
            score
        } = req.body;

        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        const attempt = await UserExerciseAttempt.create({
            user_id: userId,
            exercise_id: exerciseId,
            user_answer,
            total_gaps,
            correct_gaps,
            is_fully_correct,
            score
        });

        res.status(201).json({
            message: "Attempt saved",
            attempt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving attempt" });
    }
};

export const getExerciseAttemptById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const attempt = await UserExerciseAttempt.findOne({
            where: {
                id,
                user_id: userId
            },
            include: [
                {
                    model: Exercise,
                    as: 'exercise',
                    include: [{
                        model: Subcategory
                    }]
                },
                {
                    model: AttemptExplanation
                }
            ]
        });

        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }

        res.json(attempt);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching attempt" });
    }
};

export const getUserAttempts = async (req, res) => {
    try {
        const userId = req.user.id;

        const attempts = await UserExerciseAttempt.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: Exercise,
                    as: 'exercise',
                    // Removed invalid attributes like title/difficulty
                    include: [
                        {
                            model: Subcategory,
                            attributes: ['name'],
                            include: [{
                                model: Category,
                                attributes: ['name']
                            }]
                        },
                        {
                            model: Level,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user attempts" });
    }
};
