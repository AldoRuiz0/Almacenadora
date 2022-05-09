const express = require('express');

const usuarioController=require('../controllers/usuario.controller')
const md_autentication = require('../middlewares/autentication');
const md_rol = require('../middlewares/roles');

const api = express.Router();

api.post('/login', usuarioController.Login)
api.post('/crearUsuario', usuarioController.CrearUsuario),
api.delete('/eliminarUsuario/:idUsuario?', [md_autentication.Auth], usuarioController.EliminarUsuario),
api.put('/editarUsuario/:idUsuario?', [md_autentication.Auth], usuarioController.EditarUsuario),
api.post('/crearAdmin', [md_autentication.Auth, md_rol.ConfirmarAdmin], usuarioController.CrearAdmon);


module.exports = api;