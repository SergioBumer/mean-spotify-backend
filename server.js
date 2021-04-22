const express = require('express');

const server = express();
server.use(express.json());


// Cargar rutas

const userRoutes = require('./routes/user');
const artistRoutes = require('./routes/artist');
const albumRoutes = require('./routes/album');
const songRoutes = require('./routes/song');

//Cabeceras HTTp

// Rutas Base

server.use('/api', userRoutes);
server.use('/api', artistRoutes);
server.use('/api', albumRoutes);
server.use('/api', songRoutes);


module.exports = server;