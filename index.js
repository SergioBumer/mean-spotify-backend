const mongoose = require('mongoose');
const server = require('./server');
const PORT = process.env.PORT = 3977;

// Conexión a base de datos
const config = require('./config');


const connectionUrl = `mongodb+srv://${config.USER}:${config.PASSWORD}@${config.DBHOST}/${config.DBNAME}?retryWrites=true&w=majority`;


mongoose.connect(connectionUrl, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Conectado correctamente a la base de datos');

        server.listen(PORT, () => {
            console.log(`Servidor del API REST escuchando en http:localhost:${PORT}`);
        });
    }

});