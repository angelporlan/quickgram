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

        const user = req.user;

        const REWARD_MAP = {
            free: 10,
            pro: 15,
            premium: 20
        };

        const activeRole = user.getActiveRole();

        const coinsToAdd = REWARD_MAP[activeRole] || 10;
        user.coins = (user.coins || 0) + coinsToAdd;

        const todayStr = new Date().toISOString().split('T')[0];
        const { Op } = await import("sequelize");
        const numberOfAttemptsToday = await UserExerciseAttempt.count({
            where: {
                user_id: user.id,
                created_at: { [Op.gte]: todayStr }
            }
        });

        const dailyGoal = user.daily_goal || 5;

        if (numberOfAttemptsToday >= dailyGoal) {
            const lastCompleted = user.last_completed_date;

            if (lastCompleted !== todayStr) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastCompleted === yesterdayStr) {
                    user.streak = (user.streak || 0) + 1;
                } else {
                    user.streak = 1;
                }
                user.last_completed_date = todayStr;
            }
        }

        await user.save();

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
