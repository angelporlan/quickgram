import { UserExerciseAttempt } from "../models/UserExerciseAttempt.js";
import { Exercise } from "../models/Exercise.js";
import { Subcategory } from "../models/Subcategory.js";
import { Category } from "../models/Category.js";
import { Level } from "../models/Level.js";
import { Sequelize, Op } from "sequelize";

import { AiUsageDaily } from "../models/AiUsageDaily.js";
import { AI_LIMITS } from "../config/aiLimits.js";

export const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalAttempts = await UserExerciseAttempt.count({
            where: { user_id: userId }
        });

        const totalCorrectGaps = await UserExerciseAttempt.sum('correct_gaps', {
            where: { user_id: userId }
        });

        const totalTotalGaps = await UserExerciseAttempt.sum('total_gaps', {
            where: { user_id: userId }
        });

        const globalScore = totalTotalGaps
            ? (totalCorrectGaps / totalTotalGaps)
            : 0;

        const totalExercises = await Exercise.count();
        const completedUniqueExercises = await UserExerciseAttempt.count({
            where: { user_id: userId },
            distinct: true,
            col: 'exercise_id'
        });

        const progressByCategory = await UserExerciseAttempt.findAll({
            where: { user_id: userId },
            attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("UserExerciseAttempt.id")), "attempts"],
                [Sequelize.fn("SUM", Sequelize.col("correct_gaps")), "correct"]
            ],
            include: {
                model: Exercise,
                as: 'exercise',
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
            group: ["exercise.Subcategory.Category.id", "exercise.Subcategory.Category.name"]
        });

        const progressByLevel = await UserExerciseAttempt.findAll({
            where: { user_id: userId },
            attributes: [
                [Sequelize.fn("COUNT", Sequelize.col("UserExerciseAttempt.id")), "attempts"],
                [Sequelize.fn("SUM", Sequelize.col("correct_gaps")), "correct"]
            ],
            include: {
                model: Exercise,
                as: 'exercise',
                attributes: [],
                include: {
                    model: Level,
                    attributes: ["id", "name"]
                }
            },
            group: ["exercise.Level.id", "exercise.Level.name"]
        });

        const lastAttempts = await UserExerciseAttempt.findAll({
            where: { user_id: userId },
            order: [["created_at", "DESC"]],
            limit: 10,
            include: {
                model: Exercise,
                as: 'exercise',
                attributes: ["id", "type"]
            }
        });

        res.json({
            global: {
                attempts: totalAttempts,
                correct: totalCorrectGaps || 0,
                score: Number(globalScore.toFixed(2))
            },
            byCategory: progressByCategory,
            byLevel: progressByLevel,
            lastAttempts,
            syllabus: {
                total: totalExercises,
                completed: completedUniqueExercises
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting user progress" });
    }
};

export const getMyAiUsage = async (req, res) => {
    try {
        const user = req.user;
        const today = new Date().toISOString().split("T")[0];

        const usage = await AiUsageDaily.findOne({
            where: {
                user_id: user.id,
                date: today
            }
        });

        const isExpired = user.subscription_expires_at && new Date() > new Date(user.subscription_expires_at);
        const effectiveRole = (user.subscription_role !== "free" && isExpired) ? "free" : user.subscription_role;
        const limit = AI_LIMITS[effectiveRole] ?? 0;

        const used = usage?.used ?? 0;

        return res.json({
            date: today,
            subscription: user.subscription_role,
            is_expired: !!isExpired,
            expiration_date: user.subscription_expires_at,
            effective_role: effectiveRole,
            used,
            remaining: Math.max(limit - used, 0),
            limit
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching AI usage" });
    }
};

export const changeRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = req.user;

        if (!role || !Object.keys(AI_LIMITS).includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        user.subscription_role = role;
        await user.save();

        res.json({ message: "Role changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error changing role" });
    }
};

export const userInformation = async (req, res) => {
    try {
        const userData = req.user;
        await userData.checkStreak();

        const user = userData.toJSON();
        delete user.password_hash;
        if (user.subscription_expires_at && new Date() > new Date(user.subscription_expires_at)) {
            user.subscription_role = "free";
        }
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user information" });
    }
};

export const updateUserInfo = async (req, res) => {
    try {
        const user = req.user;
        const { name, username } = req.body;

        if (!name && !username) {
            return res.status(400).json({ message: "At least one field (name or username) is required" });
        }

        if (name) user.name = name;
        if (username) {
            // Check if username already exists
            const { User } = await import("../models/User.js");
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: "Username already taken" });
            }
            user.username = username;
        }

        await user.save();
        const updatedUser = user.toJSON();
        delete updatedUser.password_hash;

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user information" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }

        // Verify current password
        const bcrypt = await import("bcrypt");
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating password" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        await user.destroy();
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting account" });
    }
};

export const getNumberOfAttemptsToday = async (req, res) => {
    try {
        const user = req.user;
        await user.checkStreak();

        const today = new Date().toISOString().split("T")[0];
        const numberOfAttempts = await UserExerciseAttempt.count({ where: { user_id: user.id, created_at: { [Op.gte]: today } } });

        const dailyGoal = user.daily_goal || 5;
        const percentage = Math.min(Math.floor((numberOfAttempts / dailyGoal) * 100), 100);

        res.json({ numberOfAttempts, dailyGoal, percentage, streak: user.streak || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting number of attempts" });
    }
};

export const updateDailyGoal = async (req, res) => {
    try {
        const user = req.user;
        const { daily_goal } = req.body;

        if (daily_goal === undefined || daily_goal < 1 || daily_goal > 100) {
            return res.status(400).json({ message: "Daily goal must be between 1 and 100" });
        }

        user.daily_goal = daily_goal;
        await user.save();

        res.json({ message: "Daily goal updated", daily_goal: user.daily_goal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating daily goal" });
    }
};
