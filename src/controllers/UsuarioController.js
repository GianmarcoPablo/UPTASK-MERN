import Usuario from "../models/Usuario.js"
import generarID from "../helpers/generarID.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"

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
        await objUsuario.save()
        //Enviar el email de confimracion
        emailRegistro({
            email: objUsuario.email,
            nombre: objUsuario.nombre,
            token: objUsuario.token
        })
        res.json({ msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta" })
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

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(404).json({ msg: error.message })
    }
    try {
        usuarioConfirmar.token = ""
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.status(201).json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg: error.message })
    }
    try {
        usuario.token = generarID()
        await usuario.save()
        emailOlvidePassword({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })
        res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({ token })
    if (!tokenValido) {
        const error = new Error("Token no valido")
        return res.status(404).json({ msg: error.message })
    }
    res.json({ msg: "Token valido y el Usuario existe" })
}

const nuevoPassword = async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const usuario = await Usuario.findOne({ token })
    if (!usuario) {
        const error = new Error("Token no valido")
        return res.status(404).json({ msg: error.message })
    }
    try {
        usuario.password = password
        usuario.token = ""
        await usuario.save()
        res.json({ msg: "Password Modificado correctamente" })
    } catch (error) {
        console.log(error);
    }
}

const perfil = async (req, res) => {
    const { usuario } = req
    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}