import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const AiUsageDaily = sequelize.define(
    "AiUsageDaily",
    {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        used: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "ai_usage_daily",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "date"]
            }
        ]
    }
);
