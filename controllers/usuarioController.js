const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extraer email y password
    const {email, password} = req.body;

    try {
        // Revisar que usuario sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        // crea nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);

        // guardar usuario
        await usuario.save();

        // Crear y firmar JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        }, (error, token) => {
            if (error) throw error;

            // Mensaje
            res.json({ token });

        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }
}