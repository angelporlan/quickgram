import { sequelize } from "./src/config/db.js";
import { User, UserExerciseAttempt, Exercise, Subcategory, Level } from "./src/models/index.js";

async function test() {
    try {
        await sequelize.authenticate();
        console.log("DB connected.");

        const user = await User.findOne();
        if (!user) {
            console.log("No user found");
            return;
        }

        const attempts = await UserExerciseAttempt.findAll({
            where: {
                user_id: user.id
            },
            include: [
                {
                    model: Exercise,
                    as: 'exercise',
                    // Removed invalid attributes
                    include: [
                        {
                            model: Subcategory,
                            attributes: ['name']
                        },
                        {
                            model: Level,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        console.log("Query success. Found:", attempts.length);
        if (attempts.length > 0) {
            const att = attempts[0];
            console.log("Sample Exercise:", att.exercise.question_text.substring(0, 20) + "...");
            console.log("Level:", att.exercise.Level ? att.exercise.Level.name : "N/A");
            console.log("Subcategory:", att.exercise.Subcategory ? att.exercise.Subcategory.name : "N/A");
        }
    } catch (error) {
        console.log("ERROR:", error.message);
    } finally {
        await sequelize.close();
    }
}

test();
