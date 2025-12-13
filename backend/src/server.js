import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import "./models/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

await sequelize.sync({ alter: true });

sequelize.sync().then(() => {
    console.log("Base de datos conectada");

    const PORT = process.env.ENV === "TEST" ? process.env.PORT_TEST : process.env.PORT_PROD;
    const URL = process.env.ENV === "TEST" ? process.env.URL_TEST : process.env.URL_PROD;

    app.listen(PORT, () =>
        console.log(`Servidor corriendo en ${URL}:${PORT}`)
    );
});
