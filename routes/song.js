const express = require('express');
const multipart = require('connect-multiparty');
const fs = require('fs');
const dir = './uploads/songs';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}
const md_upload = multipart({ uploadDir: './uploads/songs' });

const SongController = require('../controllers/song');
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api.post('/song', ensureAuth, SongController.saveSong);
api.get('/song/:id', ensureAuth, SongController.getSong);
api.get('/songs/:album?', ensureAuth, SongController.getSongs);
api.patch('/song/:id?', ensureAuth, SongController.updateSong);
api.delete('/song/:id?', ensureAuth, SongController.deleteSong);
// Manejo de fichero de audios
api.post('/uploadSongFile/:id', [ensureAuth, md_upload], SongController.uploadSongFile);
api.get('/getSongFile/:songFile', [ensureAuth, md_upload], SongController.getSongFile);


module.exports = api;