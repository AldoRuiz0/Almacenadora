const jwt_simple = require('jwt-simple');
const moment  = require('moment');
const secret = 'key_';

exports.Auth = function(req,res, next ){
    if(!req.headers.authorization){
        return res.status(404).send({mesaje: 'La peticion, no posee la cabecera de authorization'})

    }
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt_simple.decode(token, secret);

        if(payload.exp <=moment().unix){
            return res.status(404).send({mesaje:'el token ya ha expirado'});
        }

    }catch(error){
        return res.status(500).send({mesaje:'el token no es valido'})
    }

    req.user = payload;
    next();
}