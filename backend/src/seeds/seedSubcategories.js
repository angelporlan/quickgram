import { Category } from "../models/Category.js";
import { Subcategory } from "../models/Subcategory.js";

export const seedSubcategories = async () => {
    const grammar = await Category.findOne({ where: { name: "Grammar" } });
    const vocabulary = await Category.findOne({ where: { name: "Vocabulary" } });
    const reading = await Category.findOne({ where: { name: "Reading" } });
    const listening = await Category.findOne({ where: { name: "Listening" } });
    const useOfEnglish = await Category.findOne({ where: { name: "Use of English" } });
    const writing = await Category.findOne({ where: { name: "Writing" } });

    const subcategories = [
        // Grammar
        {
            name: "Tenses",
            category_id: grammar.id,
            description: "Practice and understanding of verb tenses (present, past, future, perfects) and their uses."
        },
        {
            name: "Conditionals",
            category_id: grammar.id,
            description: "Exercises on conditional structures (types zero, one, two, three, and mixed)."
        },
        {
            name: "Passive Voice",
            category_id: grammar.id,
            description: "Construction and use of the passive voice in different tenses and contexts."
        },

        // Vocabulary
        {
            name: "Travel",
            category_id: vocabulary.id,
            description: "Vocabulary related to travel, airports, hotels, transportation, and tourist destinations."
        },
        {
            name: "Work",
            category_id: vocabulary.id,
            description: "Vocabulary specific to business, job interviews, offices, and workplace terminology."
        },
        {
            name: "Education",
            category_id: vocabulary.id,
            description: "Terms related to school, university, subjects, and study methods."
        },

        // Reading
        {
            name: "Multiple Choice Reading",
            category_id: reading.id,
            description: "Detailed reading to identify opinion, tone, purpose, main idea, and attitude. Selection between options A, B, C, or D."
        },
        {
            name: "Gapped Text",
            category_id: reading.id,
            description: "Test of text structure and cohesion. Involves reinserting paragraphs or sentences extracted into the correct gaps."
        },
        {
            name: "Multiple Matching",
            category_id: reading.id,
            description: "Rapid scanning to locate specific information and understand paraphrasing. Match statements with the correct section of the text."
        },

        // Listening
        {
            name: "Short Dialogues",
            category_id: listening.id,
            description: "Comprehension of brief conversations and extraction of specific information."
        },
        {
            name: "Long Audios",
            category_id: listening.id,
            description: "Listening comprehension of extended monologues or conversations, including details and context."
        },

        // Use of English
        {
            name: "Gap Fill",
            category_id: useOfEnglish.id,
            description: "Fill-in-the-blank exercises focusing on grammar, collocations, and *phrasal verbs*."
        },
        {
            name: "Multiple Choice",
            category_id: useOfEnglish.id,
            description: "Selection of the correct word or phrase among several options to complete sentences or texts."
        },
        {
            name: "Word Formation",
            category_id: useOfEnglish.id,
            description: "Formation of words from prefixes, suffixes, and roots."
        },
        {
            name: "Key Word Transformation",
            category_id: useOfEnglish.id,
            description: "Rewrite sentences keeping the original meaning and using a mandatory key word."
        },

        // Writting, email, letter
        {
            name: "Essay",
            category_id: writing.id,
            description: "Academic essay (Compulsory Part 1). Requires opinion, arguments, and conclusion."
        },
        {
            name: "Article",
            category_id: writing.id,
            description: "Article for a magazine or website. Interesting tone, catchy title, rhetorical questions, and personal opinion."
        },
        {
            name: "Review",
            category_id: writing.id,
            description: "Critical review of books, movies, restaurants, or products, ending with a recommendation."
        },
        {
            name: "Report",
            category_id: writing.id,
            description: "Formal report for a superior or group. Clear structure with headings, objective data, and suggestions."
        },
        {
            name: "Email",
            category_id: writing.id,
            description: "Email. Can be informal (to a friend) or formal, responding to specific questions."
        },
        {
            name: "Letter",
            category_id: writing.id,
            description: "Formal letter (job application, complaint) or informal. Defined structure and salutations/closings."
        }
    ];

    for (const sub of subcategories) {
        await Subcategory.findOrCreate({
            where: { name: sub.name, category_id: sub.category_id },
            defaults: { description: sub.description }
        });
    }

    console.log("Subcategories seeded");
};
