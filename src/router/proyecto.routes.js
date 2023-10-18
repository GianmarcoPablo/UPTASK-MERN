import { Router } from "express"
import checkAuth from "../middleware/checkAuth.js"
import { obtenerProyectos, nuevoProyecto, obtenerProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador } from "../controllers/ProyectoController.js"

const router = Router()

router.route("/").get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto)

router.route("/:id").get(checkAuth, obtenerProyecto).put(checkAuth, editarProyecto).delete(checkAuth, eliminarProyecto)

router.post("/agregar-colaborador/:id", checkAuth, agregarColaborador)
router.post("/agregar-colaborador/:id", checkAuth, eliminarColaborador)

export default router