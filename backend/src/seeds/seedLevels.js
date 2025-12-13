import { Level } from "../models/Level.js";

export const seedLevels = async () => {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

    for (const name of levels) {
        await Level.findOrCreate({
            where: { name }
        });
    }

    console.log("Levels seeded");
};
