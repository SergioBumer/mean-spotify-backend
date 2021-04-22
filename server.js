const express = require('express');

const server = express();
server.use(express.json());


// Cargar rutas

const userRoutes = require('./routes/user');

//Cabeceras HTTp

// Rutas Base

server.use('/api', userRoutes);


module.exports = server;