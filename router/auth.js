const {Router} = require('express');
const {validationResult, check} = require('express-validator');
const router = Router();
const Usuario = require('../models/Usuario');
const bycript= require('bcryptjs');
const {generarJWT} =require('../helpers/jwt');

router.post('/', [
    check('email','email.requerido').isEmail(),
    check('contrasena','contrasena.requerida').not().isEmpty(),
], async function(req,res){
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array});
        }

        const usuario = await Usuario.findOne({email: req.body.email});
        if (!usuario){
            return res.status(400).json({mensaje: 'Usuario no encontrado'});
        }

        const esIgual=bycript.compareSync(req.body.contrasena, usuario.contrasena); 
        if(!esIgual){
            return res.status(400).json({mensaje: 'Usuario no encontrado'});
        }

        const token = generarJWT(usuario);

        res.json({_id: usuario._id, nombre: usuario.nombre, rol: usuario.rol, email: usuario.email, access_token: token });
    }catch(error){
        console.log(error);
        res.status(500).json({mensaje: 'Internal server error'});     
    }
});

module.exports = router;