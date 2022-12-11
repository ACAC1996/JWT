const {Router} = require('express');
const Inventario = require('../models/Inventario');
const {validarInventario} = require('../helpers/validar-inventario');
const {validarJWT}=require('../middlewares/validar-jwt');
const {validarRolAdmin}=require('../middlewares/validar-rol-admin');

const router = Router();

router.post('/',[
    validarJWT,
    validarRolAdmin
], async function(req,res){
    try{
        const validaciones= validarInventario(req);

        if(validaciones.lenght > 0){
            return res.status(400).send(validaciones());
        }
        const existeInventarioPorSerial = await Inventario.findOne({serial: req.body.serial});
        if(existeInventarioPorSerial){
            return res.status(400).send('Ya existe el serial para otro equipo');
        }

        const inventario = new Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);
    }catch(error){
        console.log(error);
        res.status(400).send('Ocurrió un error al consultar inventarios');
    } 
});

router.get('/',[
    validarJWT
], async function(req,res){
    try{
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },
            {
                path: 'marca', select: 'nombre estado'
            },
            {
                path: 'tipoEquipo', select: 'nombre estado'
            },
            {
                path: 'estadoEquipo', select: 'nombre estado'
            }
        ]);
        res.send(inventarios);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar inventarios');
    }
});

router.put('/:inventarioId',[
    validarJWT,
    validarRolAdmin
], async function(req,res){
    try{
        const validaciones= validarInventario(req);

        if(validaciones.lenght > 0){
            return res.status(400).send(validaciones());
        }

        let inventario = await Inventario.findById(req.params.inventarioId);
        if(!inventario){
            return res.status(400).send('Inventario no existe');
        }

        const existeInventarioPorSerial = await Inventario.findOne({serial: req.body.serial, _id: {$ne: inventario._id}});
        if(existeInventarioPorSerial){
            return res.status(400).send('Ya existe el serial para otro equipo');
        }

        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar inventarios');
    } 
});

router.get('/:inventarioId',[
    validarJWT,
    validarRolAdmin
], async function(req, res){
    try{
        const inventario = await Inventario.findById(req.params.inventarioId);
        if(!inventario){
            return res.status(404).send('Inventario no existe');
        }
        res.send(inventario);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al consultar inventarios');
    }
})

module.exports = router;