const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const Song = require('../models/song');

const validExtensions = [
    "mp3", "wav"
]

function saveSong(req, res) {

    const params = req.body;
    const song = Song();

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = "";
    song.album = params.album;

    if (song.name != null && song.duration != null) {
        song.save((err, songStored) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al guardar la canción."
                })
            } else {
                if (!songStored) {
                    return res.status(404).send({
                        message: "No se ha guardado la canción."
                    })
                } else {
                    return res.status(201).send({
                        message: "Canción guardada satisfactoriamente."

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

function getSong(req, res) {
    const songId = req.params.id;

    Song.findById(songId).populate({ path: 'album' }).exec((err, songStored) => {
        if (err) {
            return res.status(500).send({
                message: "Error al obtener la canción."
            })
        } else {
            if (!songStored) {
                return res.status(404).send({
                    message: "No se ha encontrado la canción."
                })
            } else {
                return res.status(201).send(songStored);
            }
        }
    });
}

function getSongs(req, res) {

    const albumId = req.params.album;
    let find = null;
    if (!albumId) {
        find = Song.find({}).sort('title');
    } else {
        find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            console.error(`[ERROR] Ha ocurrido un error: ${err.message}`);
            res.status(500).send({
                message: "Error en el servidor"
            })
        } else {
            if (!songs) {
                res.status(404).send({
                    message: "No se encuentran canciones."
                })
            } else {
                res.send({ songs: songs });
            }
        }
    });
}

function updateSong(req, res) {
    const songId = req.params.id;
    const update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({
                "message": `Error al actualizar la canción ${songId}`
            });
        } else {
            if (!songUpdated) {
                res.status(404).send({
                    "message": `Error al actualizar la canción. Canción no encontrada.`
                });
            } else {
                res.status(200).send({
                    song: songUpdated
                });
            }
        }
    });
}

function deleteSong(req, res) {
    const songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({
                "message": `Error al eliminar la canción ${songId}`
            });
        } else {
            if (!songRemoved) {
                res.status(404).send({
                    "message": `No se ha eliminado la canción.`
                });
            } else {
                res.send({ song: songRemoved });
            }
        }
    });
}

function uploadSongFile(req, res) {
    var songId = req.params.id;
    var file_name = "No subido...";

    if (req.files) {
        var file_path = req.files.file.path;

        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];

        if (validExtensions.includes(file_ext)) {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({
                        "message": `Error al actualizar la canción ${songId}`
                    });
                } else {
                    if (!songUpdated) {
                        res.status(404).send({
                            "message": `Error al actualizar la canción. Canción no encontrada.`
                        });
                    } else {
                        res.status(200).send({
                            song: songUpdated
                        });
                    }
                }
            });
        } else {
            res.status(502).send('Archivo no válido');
        }
    } else {
        res.status(404).send('No se ha subido ningun fichero de audio.');
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/' + songFile;
    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send('No existe el fichero de audio.');
        }
    });
}

module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadSongFile,
    getSongFile
};