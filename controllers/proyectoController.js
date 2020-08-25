const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


exports.crearProyecto = async (req,res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // crear nvo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar creador 
        proyecto.creador = req.usuario.id;

        proyecto.save();

        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}

//obtener proyectos
exports.obtenerProyectos = async(req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({ proyectos });


    } catch (error) {
        console.log(error);
        res.status(500).send("hubo un error");
    }
}


// actualizar proyecto
exports.actualizarProyecto = async (req, res) =>{
    
    //Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    //extraer nueva infor
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        
        // ver id
        let proyecto = await Proyecto.findById(req.params.id);

        // ver si existe
        if(!proyecto){
            return res.status(404).json({ msg: 'proyecto no encontrado' });
        }

        // verificar creador
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // update
        proyecto = await Proyecto.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: nuevoProyecto },
            { new: true}
            );

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor');
    }
}

// Elimina proyecto por id 
exports.eliminarProyecto = async (req, res)=> {
    try {
        // ver id
        let proyecto = await Proyecto.findById(req.params.id);

        // ver si existe
        if(!proyecto){
            return res.status(404).json({ msg: 'proyecto no encontrado' });
        }

        // verificar creador
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // ELiminar proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id});
        res.json({ msg: 'Proyecto eliminado' });

    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor');
    }
}