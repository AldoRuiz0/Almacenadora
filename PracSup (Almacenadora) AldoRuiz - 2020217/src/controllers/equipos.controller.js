const Equipo = require('../models/equipos.model');
const Liga = require('../models/liga.model');



function AgregarEquipo(req, res) {
    const modelEquipo = new Equipo();
    var parametros = req.body;
    var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese el usuario"
            });
        }
        idUsuario = req.params.idUsuario;
    }
    Equipo.findOne({ idUsuario: idUsuario, nombre: parametros.nombre }, (err, equipoEncontrado) => {
        if (equipoEncontrado) {
            res.status(500).send({ error: "El equipo ya ha sido creado" })
        } else {
            if (parametros.liga == null) return res
                .status(500).send({ mensaje: "Asigne una Liga al Equipo" });

            Liga.findOne({ nombre: parametros.liga }, (err, ligaEncontrada) => {
                if (ligaEncontrada == null) {
                    res.status(500).send({ error: "La liga que trata de asignar NO existe" })
                } else {
                    Equipo.find({ idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                        if (equiposEncontrados.length <= 10) {
                            if (parametros.nombre) {
                                modelEquipo.nombre = parametros.nombre
                                modelEquipo.golesAnotados = 0;
                                modelEquipo.golesRecibidos = 0;
                                modelEquipo.golesDiff = 0;
                                modelEquipo.partJugados = 0;
                                modelEquipo.puntos = 0;
                                modelEquipo.idUsuario = idUsuario;
                                modelEquipo.idLiga = ligaEncontrada._id;

                                modelEquipo.save((err, equipoCreado) => {
                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                    if (!equipoCreado)
                                        return res.status(500).send({ mensaje: "Error al crear equipo" });
                                    return res.status(200).send({ equipo: equipoCreado });
                                })
                            } else {
                                return res.status(500)
                                    .send({ mensaje: "Ingrese un nombre para el equipo" });
                            }
                        } else {
                            return res.status(500)
                                .send({ mensaje: "No se pueden crear más equipos para esta liga"});
                        }
                    })
                }

            })
        }
    })
}

function EliminarEquipo(req, res) {
    var idUsuario;
    nombreEquipo = req.params.nombre

    if (req.params.nombre == null) return res.status(500).send({ error: "Ingrese el nombre del equipo para ELIMINAR" })

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }
    Equipo.findOneAndDelete({ nombre: req.params.nombre, idUsuario: idUsuario }, { nombre: req.body.nombre }, (err, equipoEditado) => {
        if (equipoEditado == null)
            return res.status(500).send({ error: "No se ha encontrado el equipo" });
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

        return res.status(200).send({ equipo: equipoEditado });
    })
}

function EditarEquipo(req, res) {
    var parametros = req.body;
    var nombreEquipo = req.params.nombre;

    if (nombreEquipo == null) return res.status(500).send({ error: "Ingrese el nombre del equipo para EDITAR" })

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Equipo.findOne({ nombre: parametros.nombre, idUsuario: idUsuario }, (err, equipoRepetido) => {
        if (equipoRepetido) {
            return res.status(500).send({ error: "Este nombre ya esta en uso" });
        } else {
            Equipo.findOneAndUpdate({ nombre: nombreEquipo, }, (parametros), { new: true }, (err, equipoEditado) => {
                if (equipoEditado == null)
                    return res.status(500).send({ error: "No se ha encontrado el equipo" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({ equipo: equipoEditado });
            })
        }
    })
}

function VerEquipos(req, res) {
    var idUsuario;

    if (req.params.liga == null) return res.status(500)
    .send({ error: "Ingrese el nombre del equipo para MOSTRAR" })
    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne({ nombre: req.params.liga, idUsuario: idUsuario }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res.status(500).send({ error: "No se ha encontrado la Liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                if (equiposEncontrados.length == 0) return res.status(500).send({ mensaje: "La liga no tiene equipos aun" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({ equipos: equiposEncontrados })
            }).select('nombre')
        }
    })
}

function TablaLigas(req, res) {
    var idUsuario;

    if (req.params.liga == null) return res.status(500).send({ error: "Ingrese el nombre de la Liga para MOSTRAR la tabla" })

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese el usuario",
            });
        }
        idUsuario = req.params.idUsuario;
    }
    Liga.findOne({ nombre: req.params.liga, idUsuario: idUsuario }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res.status(500).send({ error: "No se ha encontrado la Liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                if (equiposEncontrados.length == 0) 
                return res.status(500).send({ mensaje: "La liga no tiene equipos aun" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                return res.status(200).send({ tabla: equiposEncontrados })
            }).sort({ puntos: -1 })
        }
    })
}


module.exports = {
    AgregarEquipo,
    EditarEquipo,
    EliminarEquipo,
    VerEquipos,
    TablaLigas
}