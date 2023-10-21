import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"

const obtenerProyectos = async (req, res) => {
    //Que cada usuario pueda obtener solo loso proyectos que ellos crearon
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario).select("-tareas")
    res.json(proyectos)
}

const obtenerProyecto = async (req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id).populate("tareas").populate("colaboradores", "nombre email")
    if (!proyecto) {
        const error = new Error("No encontrado")
        return res.status(404).json({ msg: error.message })
    }
    //Que el usuario authenticado puede encontrar solo el proyecto  que el creo
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(401).json({ msg: error.message })
    }
    //obtener las tareas del proyecto
    res.json(proyecto)
}

const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const editarProyecto = async (req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(401).json({ msg: error.message })
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const eliminarProyecto = async (req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(401).json({ msg: error.message })
    }
    try {
        await proyecto.deleteOne();
        res.json({ msg: "Proyecto eliminado  " })
    } catch (error) {
        console.log(error);
    }
}

const buscarColaborador = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email }).select("-password -confirmado -createdAt -updatedAt -__v -token")
    if (!usuario) {
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({ msg: error.message })
    }
    res.json(usuario)
}
const agregarColaborador = async (req, res) => {
    const { id } = req.params
    const { email } = req.body
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(401).json({ msg: error.message })
    }
    const usuario = await Usuario.findOne({ email }).select("-password -confirmado -createdAt -updatedAt -__v -token")
    if (!usuario) {
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({ msg: error.message })
    }
    //El colaborador no es el admin del proyecto
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("El creador del proyecto no puede ser un colaborador")
        return res.status(401).json({ msg: error.message })
    }
    //revisar que no este agregado ya al proyecto
    const colaborador = proyecto.colaboradores.find(colaborador => colaborador.toString() === usuario._id.toString())
    if (colaborador) {
        const error = new Error("El usuario ya es colaborador del proyecto")
        return res.status(401).json({ msg: error.message })
    }

    //se puede agregar al proyecto
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({ msg: "Colaborador agregado" })
}
const eliminarColaborador = async (req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida")
        return res.status(401).json({ msg: error.message })
    }

    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    res.json({ msg: "Colaborador eliminado" })
}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
}