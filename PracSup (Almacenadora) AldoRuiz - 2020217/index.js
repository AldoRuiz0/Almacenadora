const mongoose = require('mongoose');
const app = require('./app');
const {AdminPredeterminado} = require('./src/controllers/Usuario.controller')


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Almacenadora',{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{

    console.log('Se ha conectado a la base de datos exitosamente');

    app.listen(3000, function(){
        console.log('conexion al puerto 3000 de manera exitosa');
    })
}).catch(err => console.log(err));
AdminPredeterminado();