exports.ConfirmarAdmin = function(req, res, next){
    if (req.user.rol !== 'ADMIN') return res.status(403).send({mensaje:'Unicamente un ADMIN puede realizar esta accion'})
    next();
} 

exports.ConfirmarUsuario = function(req, res, next){
    if(req.user.rol !=='Usuario') return res.status(403).send({mensaje:'Unicamente un Usuario puede realizar esta accion'})

    next();

}