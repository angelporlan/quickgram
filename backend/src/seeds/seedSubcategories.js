import { Category } from "../models/Category.js";
import { Subcategory } from "../models/Subcategory.js";

export const seedSubcategories = async () => {
    const grammar = await Category.findOne({ where: { name: "Grammar" } });
    const vocabulary = await Category.findOne({ where: { name: "Vocabulary" } });
    const reading = await Category.findOne({ where: { name: "Reading" } });
    const listening = await Category.findOne({ where: { name: "Listening" } });
    const useOfEnglish = await Category.findOne({ where: { name: "Use of English" } });

    const subcategories = [
        // grammar
        { name: "Tenses", category_id: grammar.id },
        { name: "Conditionals", category_id: grammar.id },
        { name: "Passive Voice", category_id: grammar.id },

        // vocabulary
        { name: "Travel", category_id: vocabulary.id },
        { name: "Work", category_id: vocabulary.id },
        { name: "Education", category_id: vocabulary.id },

        // reading
        { name: "Main Idea", category_id: reading.id },
        { name: "Detail Comprehension", category_id: reading.id },
        { name: "Inference", category_id: reading.id },

        // listening
        { name: "Short Dialogues", category_id: listening.id },
        { name: "Long Audios", category_id: listening.id },

        // use of english
        { name: "Gap Fill", category_id: useOfEnglish.id },
        { name: "Multiple Choice", category_id: useOfEnglish.id }
    ];

    for (const sub of subcategories) {
        await Subcategory.findOrCreate({
            where: { name: sub.name, category_id: sub.category_id }
        });
    }

    console.log("Subcategories seeded");
};
