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
            name: "Multiple Choice Reading",
            category_id: reading.id,
            description: "Lectura detallada para identificar opinión, tono, propósito, idea principal y actitud. Selección entre opciones A, B, C o D."
        },
        {
            name: "Gapped Text",
            category_id: reading.id,
            description: "Prueba de estructura y cohesión del texto. Consiste en reinsertar párrafos u oraciones extraídas en los huecos correctos."
        },
        {
            name: "Multiple Matching",
            category_id: reading.id,
            description: "Escaneo rápido (scanning) para localizar información específica y entender el parafraseo. Emparejar enunciados con la sección correcta del texto."
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
        {
            name: "Word Formation",
            category_id: useOfEnglish.id,
            description: "Formación de palabras a partir de prefijos, sufijos y raíces."
        },
        {
            name: "Key Word Transformation",
            category_id: useOfEnglish.id,
            description: "Reescribir oraciones manteniendo el significado original y usando una palabra clave obligatoria."
        },

        // Writting, email, letter
        {
            name: "Essay",
            category_id: writing.id,
            description: "Ensayo académico (Compulsory Part 1). Requiere opinión, argumentos y conclusión."
        },
        {
            name: "Article",
            category_id: writing.id,
            description: "Artículo para revista o web. Tono interesante, título pegadizo, preguntas retóricas y opinión personal."
        },
        {
            name: "Review",
            category_id: writing.id,
            description: "Reseña crítica sobre libros, películas, restaurantes o productos, finalizando con una recomendación."
        },
        {
            name: "Report",
            category_id: writing.id,
            description: "Informe formal para un superior o grupo. Estructura clara con encabezados (Headings), datos objetivos y sugerencias."
        },
        {
            name: "Email",
            category_id: writing.id,
            description: "Correo electrónico. Puede ser informal (a un amigo) o formal, respondiendo a preguntas específicas."
        },
        {
            name: "Letter",
            category_id: writing.id,
            description: "Carta formal (solicitud de empleo, queja) o informal. Estructura y saludos/despedidas definidos."
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
