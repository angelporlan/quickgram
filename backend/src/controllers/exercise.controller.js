import { Exercise } from "../models/Exercise.js";
import { Subcategory } from "../models/Subcategory.js";
import { Category } from "../models/Category.js";
import { Level } from "../models/Level.js";

import { Sequelize } from "sequelize";

export const getExercises = async (req, res) => {
    try {
        const { level, subcategory, category, type, random } = req.query;

        const where = {};
        if (type) where.type = type;

        const queryOptions = {
            where,
            include: [
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
            ]
        };

        if (random) {
            queryOptions.order = [Sequelize.fn('RAND')];
            queryOptions.limit = 1;
        }

        const exercises = await Exercise.findAll(queryOptions);

        if (random) {
            return res.json(exercises[0]);
        }

        res.json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching exercises" });
    }
};
