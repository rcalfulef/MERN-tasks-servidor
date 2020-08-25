const express = require('express');
const conectarDB = require('./config/db');
const cors =  require('cors');

// crear servidor
const app = express();

// conectar a db

conectarDB();

//habilitar cors
app.use(cors());

// Habilitar express.json
app.use( express.json({ extended: true }) );

// puerto de la app
const PORT = process.env.PORT || 4000;

//IMPORTAR RUTAs
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


app.listen(PORT, () => {
    console.log(`El servidor esta en el puerto ${PORT}`);
});