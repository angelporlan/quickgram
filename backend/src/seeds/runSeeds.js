import { sequelize } from "../config/db.js";
import "../models/index.js";

import { seedLevels } from "./seedLevels.js";
import { seedCategories } from "./seedCategories.js";
import { seedSubcategories } from "./seedSubcategories.js";
import { seedExercises } from "./seedExercises.js";
import { seedUsers } from "./seedUsers.js";

const runSeeds = async () => {
    try {
        await sequelize.authenticate();
        console.log("DB connected");

        await seedLevels();
        await seedCategories();
        await seedSubcategories();
        await seedExercises();
        await seedUsers();

        console.log("All seeds executed");
        process.exit();
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

runSeeds();
