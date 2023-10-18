import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

const obtenerProyectos = async (req, res) => {
    //Que cada usuario pueda obtener solo loso proyectos que ellos crearon
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario)
    res.json(proyectos)
}

const obtenerProyecto = async (req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id)
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
    const tareas = await Tarea.find().where("proyecto").equals(id)
    res.json({
        proyecto,
        tareas
    })
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

const agregarColaborador = (req, res) => {

}
const eliminarColaborador = (req, res) => {

}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
}