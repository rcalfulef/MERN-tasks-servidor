const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    // leer token
    const token = req.header('x-auth-token');

    //revisar si no hay token
    if(!token){
        res.status(401).json({msg: 'No hay token, no puede entrar'})
    }

    //validar token 
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();

    } catch (error) {
        res.status(401).json({msg: 'Token no valido'});
    }
}