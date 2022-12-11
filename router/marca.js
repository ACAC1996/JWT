const {Router} = require('express');
const { validarMarca } = require('../helpers/validar-marca');
const Marca = require('../models/Marca');
const {validarJWT}=require('../middlewares/validar-jwt');
const {validarRolAdmin}=require('../middlewares/validar-rol-admin');

const router = Router();

router.post('/',[
    validarJWT,
    validarRolAdmin
], async function(req,res){
    try{
        const validaciones= validarMarca(req);

        if(validaciones.lenght > 0){
            return res.status(400).send(validaciones());
        }

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();
        marca = await marca.save();
        res.send(marca);
    }catch(error){
        console.log(error);
        res.send('Ocurrió un error');
    }
});

router.get('/',[
    validarJWT,
    validarRolAdmin
], async function(req,res){
    try{
        const marcas = await Marca.find();
        res.send(marcas);
    }catch(error){
        console.log(error);
        res.send('Ocurrió un error');
    }
});

router.put('/:marcaId',[
    validarJWT,
    validarRolAdmin
], async function(req,res){
    try{
        const validaciones= validarMarca(req);

        if(validaciones.lenght > 0){
            return res.status(400).send(validaciones());
        }

        let marca = await Marca.findById(req.params.marcaId);
        if (!marca){
            return res.send('Marca no existe');
        }
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();
        marca = await marca.save();
        res.send(marca);
    }catch(error){
        console.log(error);
        res.send('Ocurrió un error');
    }
});

router.get('/:marcaId',[
    validarJWT,
    validarRolAdmin
], async function(req, res){
    try{
        const marca = await Marca.findById(req.params.marcaId);
        if(!marca){
            return res.status(404).send('Inventario no existe');
        }
        res.send(marca);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar usuarios');
    }
});
module.exports = router;