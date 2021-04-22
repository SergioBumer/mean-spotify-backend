const express = require('express');
const multipart = require('connect-multiparty');
const fs = require('fs');
const dir = './uploads/albums';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}
const md_upload = multipart({ uploadDir: './uploads/albums' });

const ArtistController = require('../controllers/album');
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api.post('/album', ensureAuth, ArtistController.saveAlbum);
api.get('/album/:id', ensureAuth, ArtistController.getAlbum);
api.get('/albums/:artist?', ensureAuth, ArtistController.getAlbums);
api.patch('/album/:id', ensureAuth, ArtistController.updateAlbum);
api.delete('/album/:id', ensureAuth, ArtistController.deleteAlbum);
// Manejo de imagenes
api.post('/uploadAlbumImage/:id', [ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/getAlbumImage/:imageFile', [ensureAuth, md_upload], ArtistController.getArtistImage);

module.exports = api;