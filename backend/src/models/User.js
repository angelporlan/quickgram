import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subscription_role: {
        type: DataTypes.ENUM("free", "pro", "premium"),
        allowNull: false,
        defaultValue: "free"
    }
}, {
    tableName: "users"
});