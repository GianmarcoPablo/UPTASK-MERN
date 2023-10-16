import { Router } from "express";
import { registrar, autenticar,confirmar } from "../controllers/UsuarioController.js"

const router = Router()

//Authenticacion, Registro y confirmacion de usuarios
router.post("/", registrar)
router.post("/login", autenticar)
router.get("/confirmar/:token", confirmar)

export default router