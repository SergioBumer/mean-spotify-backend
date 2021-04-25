const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const user = require('../models/user');
const { createToken } = require('../services/jwt');
const fs = require('fs');
const path = require('path');

const validExtensions = [
    "png", "jpg", "gif", "svg"
]

function pruebas(req, res) {
    res.status(201).send({
        message: "Probando una acción del controlador de usuarios del API REST"
    })
}

function saveUser(req, res) {

    let user = new User();

    const params = req.body;

    user.name = params.name;
    user.surName = params.surName;
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
                if (user.name != null && user.surName != null && user.email != null) {
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
                                    message: "Usuario registrado satisfactoriamente.",
                                    user: userStored

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

function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                "message": `Error al actualizar el usuario ${userId}`
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    "message": `Error al actualizar el usuario. Usuario no encontrado.`
                });
            } else {
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido...";

    if (req.files) {
        var file_path = req.files.image.path;

        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];

        if (validExtensions.includes(file_ext)) {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        "message": `Error al actualizar el usuario ${userId}`
                    });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({
                            "message": `Error al actualizar el usuario. Usuario no encontrado.`
                        });
                    } else {
                        res.status(200).send({
                            image: file_name,
                            user: userUpdated
                        });
                    }
                }
            });
        } else {
            res.status(502).send('Imagen no válida');
        }
    } else {
        res.status(404).send('No se ha subido ninguna imagen');
    }
}

function getUserImage(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send('No existe la imagen.');
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getUserImage
}