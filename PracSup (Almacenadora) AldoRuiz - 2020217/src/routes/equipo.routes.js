const express = require('express');

const controladorEquipo=require('../controllers/equipos.controller')
const md_autentication = require('../middlewares/autentication');


const api = express.Router();
api.post('/agregarEquipo/:idUsuario?', md_autentication.Auth,controladorEquipo.AgregarEquipo);
api.put('/editarEquipo/:nombre/:idUsuario?',md_autentication.Auth,controladorEquipo.EditarEquipo);
api.delete('/eliminarEquipo/:nombre/:idUsuario?', md_autentication.Auth, controladorEquipo.EliminarEquipo);
api.get('/verEquipos/:liga/:idUsuario?', md_autentication.Auth, controladorEquipo.VerEquipos);
api.get('/TablaLiga/:liga/:idUsuario?', md_autentication.Auth, controladorEquipo.TablaLigas);

module.exports = api;