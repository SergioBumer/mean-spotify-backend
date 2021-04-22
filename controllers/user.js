const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const user = require('../models/user');
const { createToken } = require('../services/jwt');

function pruebas(req, res) {
    res.status(201).send({
        message: "Probando una acción del controlador de usuarios del API REST"
    })
}

function saveUser(req, res) {

    let user = new User();

    const params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = '';

    if (params.password) {
        console.log(params);
        bcrypt.hash(params.password, null, null, (err, hash) => {
            if (err) {
                throw err;
            } else {
                user.password = hash;
                if (user.name != null && user.surname != null && user.email != null) {
                    user.save((err, userStored) => {
                        if (err) {
                            return res.status(500).send({
                                message: "Error al guardar al usuario."
                            })
                        } else {
                            if (!userStored) {
                                return res.status(404).send({
                                    message: "No se ha registrado el usuario."
                                })
                            } else {
                                return res.status(201).send({
                                    message: "Usuario registrado satisfactoriamente."

                                });
                            }
                        }
                    });
                } else {
                    return res.status(502).send({
                        message: "Rellena todos los campos."
                    })
                }
            }
        });
    } else {
        return res.status(404).send({
            message: 'No se indicó la contraseña.'
        })
    }


}

function loginUser(req, res) {

    const params = req.body;

    const email = params.email;
    const password = params.password;

    user.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({
                "message": "Error en la autenticación del usuario."
            });
        } else {
            if (!user) {
                res.status(404).send({
                    "message": "El usuario no existe"
                });
            } else {
                console.log(password);
                bcrypt.compare(password, user.password, (err, check) => {
                    if (err) {
                        console.log(`[ERROR] No se pudo comparar la contraseña. ${err.message}`);
                        return res.status(500).send({
                            "message": "Error en el servidor."
                        });
                    }

                    if (check) {
                        if (params.getHash) {
                            res.send({ token: createToken(user) });
                        } else {
                            res.send(user)
                        }
                    } else {
                        res.status(401).send({
                            "message": "Los datos de autenticación no son correctos."
                        });
                    }
                });
            }
        }
    });

}


module.exports = {
    pruebas,
    saveUser,
    loginUser
}