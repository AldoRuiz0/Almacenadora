const express = require('express');

const controladorparitdo=require('../controllers/partido.controller')
const md_autentication = require('../middlewares/autentication');

const api = express.Router();

api.post('/crearPartido/:liga/:idUsuario?', md_autentication.Auth, controladorparitdo.CrearPartidos);


module.exports = api;