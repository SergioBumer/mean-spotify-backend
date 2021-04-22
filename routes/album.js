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

const AlbumController = require('../controllers/album');
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api.post('/album', ensureAuth, AlbumController.saveAlbum);
api.get('/album/:id', ensureAuth, AlbumController.getAlbum);
api.get('/albums/:artist?', ensureAuth, AlbumController.getAlbums);
api.patch('/album/:id', ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', ensureAuth, AlbumController.deleteAlbum);
// Manejo de imagenes
api.post('/uploadAlbumImage/:id', [ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/getAlbumImage/:imageFile', [ensureAuth, md_upload], AlbumController.getArtistImage);

module.exports = api;