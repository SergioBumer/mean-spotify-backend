const express = require('express');
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/users' });

const UserController = require('../controllers/user');
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api.get('/probando', ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.patch('/updateUser/:id', ensureAuth, UserController.updateUser);
api.post('/uploadImage/:id', [ensureAuth, md_upload], UserController.uploadImage);
api.get('/getImage/:imageFile', [ensureAuth, md_upload], UserController.getUserImage);

module.exports = api;