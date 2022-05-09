const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function AdminPredeterminado(){
    const usuarioModel =  new Usuario();
    usuarioModel.usuario = 'ADMIN';
    usuarioModel.contraseña = '123456';
    usuarioModel.rol= 'ADMIN';

    Usuario.find({usuario:'ADMIN'},(err,UsuarioEncontrado)=>{
        if(UsuarioEncontrado.length==0){
            bcrypt.hash('123456',null,null,(err,passwordEncriptada)=>{
                usuarioModel.contraseña = passwordEncriptada;
                usuarioModel.save((err, UsuarioGuardada)=>{

                    if(err) return console.log('Error en la peticion')
                     if(UsuarioGuardada){
                        console.log('ADMIN creado exitosamente');
                     }else{
                         console.log('No se ha logrado crear el ADMIN')
                     }
                });
            })
        }else{
            return console.log('El ADMIN se ha registrado');
        }
    })
}

function Login(req,res){
    var parametros = req.body;
    
    Usuario.findOne({ usuario: parametros.usuario }, (err, UsuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (UsuarioEncontrado) {
            bcrypt.compare(parametros.contraseña, UsuarioEncontrado.contraseña,
                (err, VerifyContraseña) => {
                    if (VerifyContraseña) {
                        if (parametros.obtenerToken == 'true') {
                            UsuarioEncontrado.contraseña = undefined;
                            return res.status(200).send({ usuario: UsuarioEncontrado })
                        } else {
                            return res.status(200).send({ token: jwt.crearToken(UsuarioEncontrado) })
                        }
                    } else {
                        return res.status(500).send({ mensaje: 'La contraseña no coincide' });
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'El usuario aun no se ha creado' })
        }
    })
}

function CrearUsuario(req,res){
    const usuarioModel =  new Usuario();
    var parametros = req.body;
  
         usuarioModel.usuario = parametros.usuario;
         usuarioModel.rol = 'Usuario';
     Usuario.find({usuario : parametros.usuario},(err,UsuarioEncontrado)=>{
         if(err) return res.status(500).send({mensaje:'Error en la peticion'})
         if(UsuarioEncontrado.length == 0){
 
             bcrypt.hash(parametros.contraseña,null,null,(err,passwordEncriptada)=>{
                 usuarioModel.contraseña = passwordEncriptada;
                 usuarioModel.save((err,UsuarioGuardada)=>{
                     if(err) return res.status(500).send({mensaje:'Error en la peticion'});
                 if(UsuarioGuardada){
                     return res.status(200).send({usuario: UsuarioGuardada})
                 }else{
                     console.log('No se ha logrado crear el Usuario')
                 }
                 })
             })
         }else{
             return res.status(500).send({mensaje:'El nombre ya esta en uso'})
         }
     })
}

 function EliminarUsuario (req, res){
    var idUser ;
    var parametros = req.body;

    if (req.user.rol=='Usuario'){
        idUser = req.user.sub;
             if (idUser !== req.user.sub )
              return res.status(500).send({ mensaje: 'No tienes permiso para ELIMINAR este usuario' });
              
            Usuario.findByIdAndDelete(idUser,  { new: true },
                (err, usuarioEliminado) => {
                if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(500)
                    .send({ mensaje: 'Error al ELIMINAR usuario' });
                            return res.status(200).send({ usuario: usuarioEliminado })
                        })
    }else if(req.user.rol=='ADMIN') {
            if(req.params.idUsuario==null){
            return res.status(500).send({mensaje:'Admin debe enviar Id de Usuario para ELIMINAR'});
              }
        idUser= req.params.idUsuario;
        Usuario.findById(idUser,(err, UsuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
            if(UsuarioEncontrado){
                    if(UsuarioEncontrado.rol=='ADMIN'){
                        return res.status(500).send({mensaje:'No puede ELIMINAR admins'});
                    }else{
                        Usuario.findByIdAndDelete(idUser,{ new:true},(err,UsuarioActualizado)=>{
                            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
                            if(UsuarioActualizado){
                                return res.status(200).send({usuario: UsuarioActualizado});
                            }else{
                                return res.status(500).send({mesaje:'Error al ELIMINAR'})
                            }
                        })
                    }
            }else{
                return res.status(500).send({mensaje:'Error al encontrar usuario'})
            }
        })
    }
}

 function EditarUsuario(req, res) {
    var idUser ;
    var parametros = req.body;

    if (req.user.rol=='Usuario'){
        idUser = req.user.sub;
             if (idUser !== req.user.sub )
              return res.status(500).send({ mensaje: 'No tienes permiso para EDITAR este usuario' });
              
            Usuario.findByIdAndUpdate(idUser, parametros, { new: true },
                (err, usuarioEliminado) => {
                if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(500)
                    .send({ mensaje: 'Error al EDITAR usuario' });
                            return res.status(200).send({ empresa: usuarioEliminado })
                        })
    }else if(req.user.rol=='ADMIN') {
            if(req.params.idUsuario==null){
            return res.status(500).send({mensaje:'Admin debe enviar Id de Usuario para EDITAR'});
              }
        idUser= req.params.idUsuario;
        Usuario.findById(idUser,(err, UsuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
            if(UsuarioEncontrado){
                    if(UsuarioEncontrado.rol=='ADMIN'){
                        return res.status(500).send({mensaje:'No puede EDITAR admins'});
                    }else{
                        Usuario.findByIdAndUpdate(idUser,parametros,{ new:true},(err,UsuarioActualizado)=>{
                            if(err) return res.status(500).send({mensaje:'Error en la peticion'});
                            if(UsuarioActualizado){
                                return res.status(200).send({usuario: UsuarioActualizado});
                            }else{
                                return res.status(500).send({mesaje:'Error al EDITAR'})
                            }
                        })
                    }
            }else{
                return res.status(500).send({mensaje:'Error al encontrar usuario'})
            }
        })
    }
}

function CrearAdmon(req,res){
    const usuarioModel =  new Usuario();
    var parametros = req.body;
  
         usuarioModel.usuario = parametros.usuario;
         usuarioModel.rol = 'ADMIN';
     
     Usuario.find({usuario : parametros.usuario},(err,UsuarioEncontrado)=>{
         if(err) return res.status(500).send({mensaje:'Error en la peticion'})
         if(UsuarioEncontrado.length == 0){
 
             bcrypt.hash(parametros.password,null,null,(err,passwordEncriptada)=>{
                 usuarioModel.password = passwordEncriptada;
                 usuarioModel.save((err,UsuarioGuardada)=>{
                     if(err) return res.status(500).send({mensaje:'Error en la peticion'});

                 if(UsuarioGuardada){
                     return res.status(200).send({empresa:UsuarioGuardada})
                 }else{
                     console.log('No se logro crear el ADMIN')
                 }
                 })
             })
         }else{
             return res.status(500).send({mensaje:'El nombre de Administrador ya esta en uso'})
         }
     })
}


 module.exports={
    AdminPredeterminado,
    Login,
    CrearUsuario,
    EditarUsuario,
    EliminarUsuario,
    CrearAdmon,
}