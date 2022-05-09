const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartidoSchema = Schema({
    idEquipo1: {type: Schema.Types.ObjectId, ref: 'Equipos'},
    golesTeam1: Number,
    idEquipo2: {type: Schema.Types.ObjectId, ref: 'Equipos'},
    golesTeam2: Number,
    idLiga: {type: Schema.Types.ObjectId, ref: 'Liga'},
    jornada: Number
});

module.exports = mongoose.model('Partidos', PartidoSchema);