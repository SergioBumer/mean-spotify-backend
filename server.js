const express = require('express');

const server = express();
server.use(express.json());


// Cargar rutas

const userRoutes = require('./routes/user');
const artistRoutes = require('./routes/artist');
const albumRoutes = require('./routes/album');
const songRoutes = require('./routes/song');

//Cabeceras HTTP
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
    res.header('Allow', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');

    next();
});
// Rutas Base

server.use('/api', userRoutes);
server.use('/api', artistRoutes);
server.use('/api', albumRoutes);
server.use('/api', songRoutes);


module.exports = server;