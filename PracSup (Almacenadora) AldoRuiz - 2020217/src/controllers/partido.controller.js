const Equipo = require('../models/equipos.model');
const Liga = require('../models/liga.model');
const Partido = require('../models/partido.model');



function DefinirEquipos(golesAnotados, golesRecibidos, idEquipo, idUsuario) {
    var punto = 0;

    if (golesAnotados > golesRecibidos || golesRecibidos == golesAnotados) {
        punto = 1;
    }
    Equipo.findOneAndUpdate({ _id: idEquipo, idUsuario: idUsuario }, { $inc: { golesAnotados: anotados, golesRecibidos: recibidos, puntos: punto, partJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
        var diferencia = Math.abs(equipoActualizado.golesAnotados - equipoActualizado.golesRecibidos)
        Equipo.findOneAndUpdate({ _id: idEquipo, idUsuario: idUsuario }, { golesDiff: diferencia }, { new: true }, (err, diferenciaActualizada) => {
            console.log(diferenciaActualizada)
        })
    })
}

function CrearPartidos(req, res) {
    const partidoModel = new Partido()
    var parametros = req.body;
    var idUsuario;
    var idEquipo1;
    var idEquipo2;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "Ingrese un ID de usuario para crear un partido",
            });
        }
        idUsuario = req.params.idUsuario;
    }
    if (req.params.liga == null) return res.status(500)
        .send({ mensaje: "Ingrese el nombre de la Liga a la que desea asignar el partido" });

    Liga.findOne({ nombre: req.params.liga }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res.status(500).send({ mensaje: "No se ha logrado encontrar la Liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {
                var LimiteJornadas;
                var LimitePartidos;

                console.log(equiposEncontrados.length)

                if (equiposEncontrados.length % 2 == 0) {
                    LimiteJornadas = (equiposEncontrados.length - 1)
                    LimitePartidos = (equiposEncontrados.length / 2)
                } else {
                    LimiteJornadas = equiposEncontrados.length
                    LimitePartidos = ((equiposEncontrados.length - 1) / 2)
                }
                if (parametros.equipo1 && parametros.equipo2 && parametros.goles1 && parametros.goles2 && parametros.jornada) {
                    if (parametros.jornada <= LimiteJornadas && parametros.jornada > 0) {
                        Partido.find({ jornada: parametros.jornada }, (err, partidosEncontrados) => {
                            if (partidosEncontrados.length < LimitePartidos) {
                                Equipo.findOne({ nombre: parametros.equipo1 }, (err, equipo1Encontrado) => {
                                    if (equipo1Encontrado) {
                                        idEquipo1 = equipo1Encontrado._id
                                        Equipo.findOne({ nombre: parametros.equipo2 }, (err, equipo2Encontrado) => {
                                            if (equipo2Encontrado) {
                                                idEquipo2 = equipo2Encontrado._id

                                                Partido.findOne({ idEquipo1: idEquipo1, jornada: parametros.jornada }, (err, partidoEncontrado) => {
                                                    if (!partidoEncontrado) {
                                                        Partido.findOne({ idEquipo2: idEquipo2, jornada: parametros.jornada }, (err, partidoEncontrado2) => {
                                                            if (!partidoEncontrado2) {
                                                                partidoModel.idEquipo1 = idEquipo1;
                                                                partidoModel.idEquipo2 = idEquipo2;
                                                                partidoModel.golesTeam1 = parametros.goles1;
                                                                partidoModel.golesTeam2 = parametros.goles2;
                                                                partidoModel.jornada = parametros.jornada;

                                                                partidoModel.save((err, partidoCreado) => {
                                                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                                                    if (!partidoCreado)
                                                                        return res.status(500).send({ mensaje: "Error al crear el partido" });

                                                                    DefinirEquipos(parametros.goles1, parametros.goles2, idEquipo1, idUsuario)

                                                                    DefinirEquipos(parametros.goles2, parametros.goles1, idEquipo2, idUsuario)

                                                                    return res.status(200).send({ partido: partidoCreado });
                                                                })

                                                            } else {
                                                                return res.status(500).send({ error: "Este equipo (2) ya ha jugado en esta jornada" })
                                                            }
                                                        })
                                                    } else {
                                                        return res.status(500).send({ error: "Este equipo (1) ya ha jugado en esta jornada" })
                                                    }
                                                })
                                            } else {
                                                return res.status(500).send({ error: "El equipo no existe aun" })
                                            }
                                        })
                                    } else {
                                        return res.status(500).send({ error: "El equipo no existe aun" })
                                    }
                                })
                            } else {
                                return res.status(500).send({ error: "La jornada ya llego a su limite" })
                            }
                        })
                    } else {
                        return res.status(500).send({ error: "Valores de jornada invalidos" })
                    }
                } else {
                    return res.status(500).send({ error: "Ingrese todos los parametros obligatorios" })
                }
            })
        }
    })
}


module.exports = {
    CrearPartidos
}