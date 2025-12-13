import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import "./models/index.js";

import exerciseAttemptRoutes from "./routes/exerciseAttempt.routes.js";
import { seedLevels } from "./seeds/seedLevels.js";
import { seedCategories } from "./seeds/seedCategories.js";
import { seedSubcategories } from "./seeds/seedSubcategories.js";
import { seedExercises } from "./seeds/seedExercises.js";
import { seedUsers } from "./seeds/seedUsers.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

app.use("/api", exerciseAttemptRoutes);

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Base de datos conectada y tablas sincronizadas");

        await seedLevels();
        await seedCategories();
        await seedSubcategories();
        await seedUsers();
        await seedExercises();
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
