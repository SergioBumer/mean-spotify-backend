const express = require('express');

const server = express();
server.use(express.json());


// Cargar rutas

const userRoutes = require('./routes/user');
const artistRoutes = require('./routes/artist');
const albumRoutes = require('./routes/album');

//Cabeceras HTTp

// Rutas Base

server.use('/api', userRoutes);
server.use('/api', artistRoutes);
server.use('/api', albumRoutes);


module.exports = server;