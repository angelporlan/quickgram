import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const AttemptExplanation = sequelize.define(
    "AttemptExplanation",
    {
        explanation: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "attempt_explanations",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);
