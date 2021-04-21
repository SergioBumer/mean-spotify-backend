const express = require('express');

const server = express();
server.use(express.json());


// Cargar rutas

//Cabeceras HTTp

// Rutas Base

server.get('/pruebas', (req, res) => {
    res.status(201).send({ "message": "Hola" });
});


module.exports = server;