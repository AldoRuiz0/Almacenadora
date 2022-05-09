const Liga = require('../models/liga.model');


function AgregarLiga(req,res){
    const modelLiga = new Liga();
    var parametros = req.body;
    var idUser= req.params.idUsuario;
    
    if (req.user.rol =='Usuario'){

        Liga.findOne({idUsuario : req.user.sub, nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});
            if(LigaEncontrada){
                return res.status(500).send({mensaje:'Error la liga ya ha sido creada'});
            }

            modelLiga.nombre = parametros.nombre;
            modelLiga.idUsuario = req.user.sub;
            modelLiga.save((err,ligaGuardada)=>{

                if(err) return res.status(500).send({mensaje:'Error en la peticion'});
                if(ligaGuardada){
                    return res.status(200).send({liga:ligaGuardada})
                }else{
                    return res.status(500).send({mensaje:'Error al crear liga'})
                }
            })
        })
    }else if (req.user.rol=='ADMIN'){
        if(idUser==null){
            return res.status(500).send({mensaje:'Admin debe enviar Id de Usuario'})
        }

        Liga.findOne({idUsuario: idUser, nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});
            if(LigaEncontrada){
                return res.status(500).send({mensaje:'Error la liga ya ha sido creada'});
            }

            modelLiga.nombre = parametros.nombre;
            modelLiga.idUsuario = idUser;
            modelLiga.save((err,ligaGuardada)=>{

                if(err) return res.status(500).send({mensaje:'Error en la peticion'});
                if(ligaGuardada){
                        return res.status(200).send({liga:ligaGuardada})
                }else{
                    return res.status(500).send({mensaje:'Error al crear La liga'})
                }
            })
        })
    }   
}

function EliminarLiga(req,res) {
    var idUsuario;

    if(req.params.nombre==null) 
    return res.status(500).send({mensaje: "Ingrese el nombre del equipo para ELIMINAR"})
    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese el usuario",
            });
        }
    }
    Liga.findOneAndDelete(
        { nombre: req.params.nombre,},
        (err, ligaEliminada) => {
            if (ligaEliminada == null)
                return res.status(500).send({ Error: "No se ha logrado encontrar la Liga" });
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            return res.status(200).send({ liga: ligaEliminada });
        }
    );
}

function EditarLiga(req,res){
    var parametros = req.body;
    var idUser= req.params.idUsuario;
   

    if (req.user.rol =='Usuario'){
       Liga.findOne({ nombre: parametros.nombre},(err,ligaEncontrada)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(ligaEncontrada){
            return res.status(500).send({mensaje:'El nombre ya esta en uso'});

        }else{
            Liga.findOne({idUsuario: req.user.sub},(err,ligaEncontradas)=>{
                if(err) return res.status(500).send({message:'Error en la peticion'});
                if(ligaEncontradas){
                    Liga.findOneAndUpdate({idUsuario :ligaEncontradas.idUsuario},parametros,{ new: true},(err,ligaEditadas)=>{
                        if(err) return res.status(500).send({message:'Error en la peticion'});
                        if(ligaEditadas){
                                return res.status(200).send({liga:ligaEditadas})
                        }else{
                            return res.status(500).send({mensaje:'Error al EDITAR 1'})
                        }
                       })
                }else{
                    return res.status(500).send({mensaje:'Error no se ha logrado encontrar esta liga'})
                }
            })
        }
       })
    }else if (req.user.rol=='ADMIN'){
        if(idUser==null){
            return res.status(500).send({mensaje:'Admin debe enviar Id de Usuario'})
        }

        Liga.findOne({ nombre: parametros.nombre},(err,LigaEncontrada)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});
            if(LigaEncontrada){
                return res.status(500).send({mensaje:'El nombre ya esta en uso'});
    
            }else{
                Liga.findByIdAndUpdate(idUser,parametros,{ new: true},
                    (err,LigaEditada)=>{
                        if(err) return res.status(500).send({message:'Error en la peticion'});
                        if(LigaEditada){
                            return res.status(200).send({liga: LigaEditada})
                        }else{
                            return res.status(500).send({mensaje:'Error al EDITAR'})
                        }
                    })
            }
           })
    }
} 

function VerLiga(req,res){
    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({mensaje:"Ingrese el usuario"});
        }
        idUsuario = req.params.idUsuario;
    }
    Liga.find({ idUsuario: idUsuario }, (err, ligasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (ligasEncontradas == null)
            return res.status(500).send({ eror: "No se ha encontrado la liga" });
        if (ligasEncontradas.length == 0)
            return res.status(500).send({ eror: "No se han creado ligas" });

        return res.status(200).send({ ligas: ligasEncontradas });
    });
}


module.exports ={
    AgregarLiga,
    EditarLiga,
    EliminarLiga,
    VerLiga
}