const Album = require('../models/album');
const Song = require('../models/song');

const mongoosePagination = require('mongoose-pagination');

// Control de archivos
const fs = require('fs');
const path = require('path');

const validExtensions = [
    "png", "jpg", "gif", "svg"
]

function getAlbum(req, res) {
    const albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            console.error(`[ERROR] Ha ocurrido un error: ${err.message}`);
            res.status(500).send({
                message: "Error en el servidor"
            })
        } else {
            if (!album) {
                res.status(404).send({
                    message: "No se encuentra el album."
                })
            } else {
                res.send(album);
            }
        }
    });
}

function getAlbums(req, res) {

    const artistId = req.params.artist;
    let find = null;
    if (!artistId) {
        find = Album.find({}).sort('title');
    } else {
        find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            console.error(`[ERROR] Ha ocurrido un error: ${err.message}`);
            res.status(500).send({
                message: "Error en el servidor"
            })
        } else {
            if (!albums) {
                res.status(404).send({
                    message: "No se encuentran albums."
                })
            } else {
                res.send({ albums: albums });
            }
        }
    });
}

function saveAlbum(req, res) {

    let album = new Album();

    const params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = "";
    album.artist = params.artist;
    if (album.title != null && album.year != null) {
        album.save((err, albumStored) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al guardar al album."
                })
            } else {
                if (!albumStored) {
                    return res.status(404).send({
                        message: "No se ha guardado el album."
                    })
                } else {
                    return res.status(201).send({
                        message: "Album guardado satisfactoriamente."

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

function updateAlbum(req, res) {
    const artistId = req.params.id;
    const update = req.body;

    Album.findByIdAndUpdate(artistId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({
                "message": `Error al actualizar el artista ${artistId}`
            });
        } else {
            if (!albumUpdated) {
                res.status(404).send({
                    "message": `Error al actualizar el album. Album no encontrado.`
                });
            } else {
                res.status(200).send({
                    album: albumUpdated
                });
            }
        }
    });
}

function deleteAlbum(req, res) {
    const albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({
                "message": `Error al eliminar el album del artista ${albumRemoved._id}`
            });
        } else {
            if (!albumRemoved) {
                res.status(404).send({
                    "message": `No se han eliminado los albumes`
                });
            } else {
                Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({
                            "message": `Error al eliminar el album del artista ${songRemoved._id}`
                        });
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({
                                "message": `No se han eliminado las canciones`
                            });
                        } else {
                            res.send({
                                album: albumRemoved
                            });
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = "No subido...";

    if (req.files) {
        var file_path = req.files.image.path;

        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];

        if (validExtensions.includes(file_ext)) {
            Album.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({
                        "message": `Error al actualizar el artista ${artistId}`
                    });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({
                            "message": `Error al actualizar el artista. Artista no encontrado.`
                        });
                    } else {
                        res.status(200).send({
                            artist: artistUpdated
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

function getArtistImage(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send('No existe la imagen.');
        }
    });
}

module.exports = {
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getArtistImage
}