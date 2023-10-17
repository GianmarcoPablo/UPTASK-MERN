import { Router } from "express";
import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from "../controllers/UsuarioController.js"
import checkAuth from "../middleware/checkAuth.js";

const router = Router()

//Authenticacion, Registro y confirmacion de usuarios
router.post("/", registrar)

router.post("/login", autenticar)

router.get("/confirmar/:token", confirmar)

router.post("/olvide-password", olvidePassword)

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

router.get("/perfil", checkAuth, perfil)

export default router