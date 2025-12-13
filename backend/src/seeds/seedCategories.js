import { Category } from "../models/Category.js";

export const seedCategories = async () => {
    const categories = [
        "Grammar",
        "Vocabulary",
        "Reading",
        "Listening",
        "Use of English"
    ];

    for (const name of categories) {
        await Category.findOrCreate({
            where: { name }
        });
    }

    console.log("Categories seeded");
};
