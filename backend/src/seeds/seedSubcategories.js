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
            description: "Práctica y comprensión de los tiempos verbales (presente, pasado, futuro, perfectos) y sus usos."
        },
        {
            name: "Conditionals",
            category_id: grammar.id,
            description: "Ejercicios sobre las estructuras condicionales (tipo cero, uno, dos, tres y mixtas)."
        },
        {
            name: "Passive Voice",
            category_id: grammar.id,
            description: "Construcción y uso de la voz pasiva en diferentes tiempos verbales y contextos."
        },

        // Vocabulary
        {
            name: "Travel",
            category_id: vocabulary.id,
            description: "Vocabulario relacionado con viajes, aeropuertos, hoteles, transporte y destinos turísticos."
        },
        {
            name: "Work",
            category_id: vocabulary.id,
            description: "Vocabulario específico de negocios, entrevistas de trabajo, oficinas y terminología laboral."
        },
        {
            name: "Education",
            category_id: vocabulary.id,
            description: "Términos relacionados con el ámbito escolar, universitario, asignaturas y métodos de estudio."
        },

        // Reading
        {
            name: "Main Idea",
            category_id: reading.id,
            description: "Habilidad para identificar el tema central y el propósito principal de un texto."
        },
        {
            name: "Detail Comprehension",
            category_id: reading.id,
            description: "Habilidad para localizar información específica y datos concretos dentro de un texto."
        },
        {
            name: "Inference",
            category_id: reading.id,
            description: "Desarrollo de la habilidad para deducir significados y conclusiones no explícitas en la lectura."
        },

        // Listening
        {
            name: "Short Dialogues",
            category_id: listening.id,
            description: "Comprensión de conversaciones breves y extracción de información puntual."
        },
        {
            name: "Long Audios",
            category_id: listening.id,
            description: "Comprensión auditiva de monólogos o conversaciones extensas, incluyendo detalles y contexto."
        },

        // Use of English
        {
            name: "Gap Fill",
            category_id: useOfEnglish.id,
            description: "Ejercicios de rellenar espacios en blanco, enfocados en gramática, colocaciones y *phrasal verbs*."
        },
        {
            name: "Multiple Choice",
            category_id: useOfEnglish.id,
            description: "Selección de la palabra o frase correcta entre varias opciones para completar oraciones o textos."
        },

        // Writting, email, letter
        {
            name: "Email",
            category_id: writing.id,
            description: "Ejercicios de redacción de correos electrónicos."
        },
        {
            name: "Letter",
            category_id: writing.id,
            description: "Ejercicios de redacción de cartas."
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
