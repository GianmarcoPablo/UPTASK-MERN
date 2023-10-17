import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import usuarioRoutes from "./router/usuario.routes.js"
import proyectoRoutes from "./router/proyecto.routes.js"
import tareaRoutes from "./router/tarea.routes.js"

const app = express()
app.use(express.json())
dotenv.config()
conectarDB()

app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareaRoutes)

app.listen(process.env.PUERTO_SERVIDOR, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PUERTO_SERVIDOR}`);
})