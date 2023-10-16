import Usuario from "../models/Usuario.js"
import generarID from "../helpers/generarID.js"
import generarJWT from "../helpers/generarJWT.js"

const registrar = async (req, res) => {
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario) {
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({ msg: error.message })
    }
    try {
        const objUsuario = new Usuario(req.body)
        objUsuario.token = generarID()
        const usuarioAlmacenado = await objUsuario.save()
        res.json(usuarioAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body
    //comprobar que el usuario existe
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg: error.message })
    }
    //comprobar que este confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({ msg: error.message })
    }
    //comrpobar su password
    if (await usuario.comprobarPassword(password)) {
        // authenticado correctamente
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        //contraseña incorrecta
        const error = new Error("Password Incorrecto")
        return res.status(403).json({ msg: error.message })
    }
}

const confirmar = (req, res) => {
    const { token } = req.params
    console.log(token);
}

export {
    registrar,
    autenticar,
    confirmar
}