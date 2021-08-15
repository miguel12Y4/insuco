const express = require('express');

const router = express.Router();

const pool = require('../database');

router.get('/getUbicacion', (req, res)=>{
    pool.query('SELECT * FROM UBICACION', (error, results) => {
        if (error) throw error;
        let data = { data : [], vista : []};
        results.forEach(element => {
            data.data.push(element.ID);
            data.vista.push(element.NOMBRE);
        });
        res.send(data);
    });
});
router.get('/getPersona', (req, res)=>{
    pool.query('SELECT * FROM ENCARGADO', (error, results) => {
        if (error) throw error;
        let data = { data : [], vista : []};
        results.forEach(element => {
            data.data.push(element.RUT);
            data.vista.push(element.NOMBRE);
        });
        res.send(data);
    });
});
router.get('/getRubro', (req, res)=>{
    pool.query('SELECT * FROM RUBRO', (error, results) => {
        if (error) throw error;
        let data = { data : [], vista : []};
        results.forEach(element => {
            data.data.push(element.ID);
            data.vista.push(element.NOMBRE);
        });
        res.send(data);
    });
});
router.get('/getEspecie', (req, res)=>{
    pool.query('SELECT * FROM ESPECIE', (error, results) => {
        if (error) throw error;
        let data = { data : [], vista : []};
        results.forEach(element => {
            data.data.push(element.ID);
            data.vista.push(element.NOMBRE);

        });
        res.send(data);
    });
});

router.get('/search', (req, res)=>{
    res.render('search', {title : "Buscar Productos"});
});



module.exports = router;