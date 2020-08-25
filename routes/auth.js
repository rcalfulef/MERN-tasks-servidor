// rutas para autenticar usuario
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Crear usuario
// api/auth
router.post('/',
    authController.autenticarUsuario
);

// obtener usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router