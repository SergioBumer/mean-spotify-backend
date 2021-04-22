const express = require('express');
const multipart = require('connect-multiparty');
const fs = require('fs');
const dir = './uploads/artists';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
        recursive: true
    });
}
const md_upload = multipart({ uploadDir: './uploads/artists' });

const ArtistController = require('../controllers/artist');
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api.post('/artist', ensureAuth, ArtistController.saveArtist);
api.get('/artist/:id', ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', ensureAuth, ArtistController.getArtists);
api.patch('/artist/:id', ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', ensureAuth, ArtistController.deleteArtist);
// Manejo de imagenes
api.post('/uploadArtistImage/:id', [ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/getArtistImage/:imageFile', [ensureAuth, md_upload], ArtistController.getArtistImage);

module.exports = api;