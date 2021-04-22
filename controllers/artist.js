const Artist = require('../models/artist');
const album = require('../models/album');
const song = require('../models/song');

const mongoosePagination = require('mongoose-pagination');

// Control de archivos
const fs = require('fs');
const path = require('path');
const { Logger } = require('mongodb');

const validExtensions = [
    "png", "jpg", "gif", "svg"
]

function getArtist(req, res) {
    const artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            console.error(`[ERROR] Ha ocurrido un error: ${err.message}`);
            res.status(500).send({
                message: "Error en el servidor"
            })
        } else {
            if (!artist) {
                res.status(404).send({
                    message: "No se encuentra el artista."
                })
            } else {
                res.send(artist);
            }
        }
    });
}

function getArtists(req, res) {

    const page = req.params.page || 1;
    const itemsPerPage = 5;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            console.error(`[ERROR] Ha ocurrido un error: ${err.message}`);
            res.status(500).send({
                message: "Error en el servidor"
            })
        } else {
            if (!artists) {
                res.status(404).send({
                    message: "No se encuentran artistas."
                })
            } else {
                res.send({ artists: artists, total_items: total });
            }
        }
    });
}

function saveArtist(req, res) {

    let artist = new Artist();

    const params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = '';
    if (artist.name != null) {
        artist.save((err, artistStored) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al guardar al artista."
                })
            } else {
                if (!artistStored) {
                    return res.status(404).send({
                        message: "No se ha guardado el artista."
                    })
                } else {
                    return res.status(201).send({
                        message: "Artista guardado satisfactoriamente."

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



function updateArtist(req, res) {
    const artistId = req.params.id;
    const update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
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
}

function deleteArtist(req, res) {
    const artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({
                "message": `Error al eliminar el artista ${artistId}`
            });
        } else {
            if (!artistRemoved) {
                res.status(404).send({
                    "message": `Artista no ha sido eliminado.`
                });
            } else {
                console.log(artistRemoved);

                album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({
                            "message": `Error al eliminar el album del artista ${artistRemoved._id}`
                        });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({
                                "message": `No se han eliminado los albumes`
                            });
                        } else {
                            song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({
                                        "message": `Error al eliminar el album del artista ${albumRemoved._id}`
                                    });
                                } else {
                                    if (!albumRemoved) {
                                        res.status(404).send({
                                            "message": `No se han eliminado las canciones`
                                        });
                                    } else {
                                        res.send({
                                            artist: artistRemoved
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    });
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
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
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
    var pathFile = './uploads/artists/' + imageFile;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send('No existe la imagen.');
        }
    });
}

module.exports = {
    saveArtist,
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getArtistImage
}