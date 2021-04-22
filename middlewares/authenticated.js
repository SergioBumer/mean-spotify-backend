const jwt = require('jwt-simple');
const moment = require('moment');

const secret = "Prueba_MEAN"

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: "El usuario no está autenticado"
        });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: `[ERROR] El token ha expirado}`
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: `[ERROR] Token no es válido: ${error.message}`
        });
    }

    req.user = payload;

    next();
}