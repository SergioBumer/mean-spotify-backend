const express = require('express');

const server = express();
server.use(express.json());


// Cargar rutas

const userRoutes = require('./routes/user');
const artistRoutes = require('./routes/artist');

//Cabeceras HTTp

// Rutas Base

server.use('/api', userRoutes);
server.use('/api', artistRoutes);


module.exports = server;