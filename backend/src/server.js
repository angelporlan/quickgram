import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import "./models/index.js";
import "dotenv/config";

import exerciseAttemptRoutes from "./routes/exerciseAttempt.routes.js";
import authRoutes from "./routes/auth.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import userRoutes from "./routes/user.routes.js";
import explanationRoutes from "./routes/explanation.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";

import { seedLevels } from "./seeds/seedLevels.js";
import { seedCategories } from "./seeds/seedCategories.js";
import { seedSubcategories } from "./seeds/seedSubcategories.js";
import { seedExercises } from "./seeds/seedExercises.js";
import { seedUsers } from "./seeds/seedUsers.js";
import { seedUserExerciseAttempts } from "./seeds/seedUserExerciseAttempts.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/public', express.static('public'));

app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

app.use("/api", exerciseAttemptRoutes);
app.use("/api", authRoutes);
app.use("/api", exerciseRoutes);
app.use("/api", userRoutes);
app.use("/api", explanationRoutes);
app.use("/api", paymentsRoutes);

(async () => {
    try {
        // await AttemptExplanation.sync();

        await sequelize.sync({ force: true });
        console.log("Base de datos conectada y tablas sincronizadas");

        await seedLevels();
        await seedCategories();
        await seedSubcategories();
        await seedUsers();
        await seedExercises();
        await seedUserExerciseAttempts();
        console.log("Seeds ejecutadas correctamente");

        const PORT = process.env.ENV === "TEST" ? process.env.PORT_TEST : process.env.PORT_PROD || 4000;
        const URL = process.env.ENV === "TEST" ? process.env.URL_TEST : process.env.URL_PROD || "http://localhost";

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en ${URL}:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor o la DB:", error);
        process.exit(1);
    }
})();
