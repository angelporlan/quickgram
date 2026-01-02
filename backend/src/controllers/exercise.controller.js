import { Exercise } from "../models/Exercise.js";
import { Subcategory } from "../models/Subcategory.js";
import { Category } from "../models/Category.js";
import { Level } from "../models/Level.js";

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
            },
            {
                model: Subcategory,
                where: subcategory ? { name: subcategory } : undefined,
                attributes: ["id", "name"],
                include: [
                    {
                        model: Category,
                        where: category ? { name: category } : undefined,
                        attributes: ["id", "name"]
                    }
                ]
            }
        ];

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
            const newInc = { ...inc, attributes: [] };
            if (newInc.include) {
                newInc.include = newInc.include.map(subInc => ({ ...subInc, attributes: [] }));
            }
            return newInc;
        });

        const { count, rows } = await Exercise.findAndCountAll({
            where,
            include: includeOptionPagination,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['id', 'title']
        });

        const cleanExercises = rows.map(exercise => ({
            id: exercise.id,
            title: exercise.title
        }));

        res.json({
            totalItems: count,
            exercises: cleanExercises,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching exercises" });
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
