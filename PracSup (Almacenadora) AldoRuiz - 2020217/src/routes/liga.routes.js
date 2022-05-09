const express = require('express');

const controladorLiga=require('../controllers/liga.controller')
const md_autentication = require('../middlewares/autentication');


const api = express.Router();
api.post('/agregarLiga/:idUsuario?', md_autentication.Auth ,controladorLiga.AgregarLiga)
api.delete('/eliminarLiga/:nombre/:idUsuario?', md_autentication.Auth, controladorLiga.EliminarLiga)
api.put('/editarLiga/:nombre/:idUsuario?', md_autentication.Auth,controladorLiga.EditarLiga)
api.get('/obtenerLigas/:idUsuario?', md_autentication.Auth, controladorLiga.VerLiga);
module.exports = api;