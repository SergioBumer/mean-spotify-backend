const express = require('express');

const UserController = require('../controllers/user');
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api.get('/probando', ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);


module.exports = api;