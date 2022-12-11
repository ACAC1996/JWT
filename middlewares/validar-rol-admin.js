const validarRolAdmin=(req,res,next)=>{
    if(req.payload.rol != 'ADMIN'){
        return res.status(400).json({mensaje: 'Error, no está autorizado'});
    }
    next();
}

module.exports={
    validarRolAdmin
}