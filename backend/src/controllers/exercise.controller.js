import { Exercise } from "../models/Exercise.js";
import { Subcategory } from "../models/Subcategory.js";
import { Category } from "../models/Category.js";
import { Level } from "../models/Level.js";
import { UserExerciseAttempt } from "../models/UserExerciseAttempt.js";

import { Sequelize } from "sequelize";

export const getExercises = async (req, res) => {
    try {
        const { level, subcategory, category, type, random, page = 1, limit = 10 } = req.query;

        const where = {};
        if (type) where.type = type;

        const includeOption = [
            {
                model: Level,
                where: level ? { name: level } : undefined,
                attributes: ["id", "name"]
            }
        ];

        const subcategoryInclude = {
            model: Subcategory,
            where: subcategory ? { name: subcategory } : undefined,
            attributes: ["id", "name"]
        };

        if (category) {
            subcategoryInclude.include = [{
                model: Category,
                where: { name: category },
                attributes: ["id", "name"]
            }];
        }

        includeOption.push(subcategoryInclude);

        // random exercise
        if (random) {
            const exercise = await Exercise.findOne({
                where,
                include: includeOption,
                order: [Sequelize.fn('RAND')]
            });
            return res.json(exercise);
        }

        const offset = (page - 1) * limit;

        const includeOptionPagination = includeOption.map(inc => {
            const newInc = { ...inc };
            if (newInc.include && newInc.include.length > 0) {
                newInc.attributes = ['id', 'category_id'];
                newInc.include = newInc.include.map(subInc => ({ ...subInc, attributes: [] }));
            } else {
                newInc.attributes = [];
            }
            return newInc;
        });

        const { count, rows } = await Exercise.findAndCountAll({
            where,
            include: [
                ...includeOptionPagination,
                {
                    model: UserExerciseAttempt,
                    where: { user_id: req.user.id },
                    required: false,
                    attributes: ['score', 'is_fully_correct', 'created_at']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['id', 'title'],
            distinct: true,
            order: [
                [UserExerciseAttempt, 'created_at', 'DESC'],
                ['id', 'ASC']
            ]
        });

        const totalCompleted = await Exercise.count({
            where,
            include: [
                ...includeOption,
                {
                    model: UserExerciseAttempt,
                    where: { user_id: req.user.id },
                    required: true
                }
            ],
            distinct: true
        });

        const cleanExercises = rows.map(exercise => {
            const attempts = exercise.UserExerciseAttempts || [];
            const latestAttempt = attempts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

            return {
                id: exercise.id,
                title: exercise.title,
                isCompleted: !!latestAttempt,
                score: latestAttempt ? latestAttempt.score : null
            };
        });

        res.json({
            totalItems: count,
            exercises: cleanExercises,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalCompleted: totalCompleted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching exercises" });
    }
};

export const getExerciseById = async (req, res) => {
    try {
        const { id } = req.params;
        const exercise = await Exercise.findByPk(id, {
            include: [
                {
                    model: Level,
                    attributes: ["id", "name"]
                },
                {
                    model: Subcategory,
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Category,
                            attributes: ["id", "name"]
                        }
                    ]
                }
            ]
        });

        if (!exercise) {
            return res.status(404).json({ message: "Exercise not found" });
        }

        res.json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching exercise" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching categories" });
    }
};

export const getSubcategories = async (req, res) => {
    try {
        const { category } = req.query;
        let where = {};

        if (category) {
            const categoryData = await Category.findOne({ where: { name: category } });

            if (!categoryData) {
                return res.status(404).json({ message: "Category not found" });
            }

            where.category_id = categoryData.id;
        }

        const subcategories = await Subcategory.findAll({ where });
        res.json(subcategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching subcategories" });
    }
};
