const express = require('express');

const router = express.Router();

const pool = require('../database');


//Obtener datos de todas las ubicaciones
router.get('/getUbicacion', (req, res)=>{
    pool.query('SELECT * FROM UBICACION', (error, results) => {
        if (error) throw error;
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.ID);
            data.text.push(element.NOMBRE);
        });
        res.send(data);
    });
});

//Obtener datos de todas las Personas
router.get('/getPersona', (req, res)=>{
    pool.query('SELECT * FROM ENCARGADO', (error, results) => {
        if (error) throw error;
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.RUT);
            data.text.push(element.NOMBRE);
        });
        res.send(data);
    });
});

//Obtener datos de todoss los rubros
router.get('/getRubro', (req, res)=>{
    pool.query('SELECT * FROM RUBRO', (error, results) => {
        if (error) throw error;
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.ID);
            data.text.push(element.NOMBRE);
        });
        res.send(data);
    });
});

//Obtener datos de todas las Especies
router.get('/getEspecie', (req, res)=>{
    pool.query('SELECT * FROM ESPECIE', (error, results) => {
        if (error) throw error;
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.ID);
            data.text.push(element.NOMBRE);

        });
        res.send(data);
    });
});

router.get('/search', (req, res)=>{
    res.render('search', {title : "Buscar Productos"});
});

router.get('/getProductos', (req, res) =>{
    //agregar try y catch


    const id = req.query.id;
    const tipo = req.query.tipo;
    console.log(id, tipo)

    let consulta = '';

    //Más adelante podria crear un procdemiento en la BD para esta consulta ya que es mas compleja
    if(tipo==="Persona"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE  EN.RUT = ? GROUP BY FECHA;';
    
    }else if(tipo==="Especie"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE E.ID = ? GROUP BY FECHA;';
    
    }else if(tipo==="Rubro"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE R.ID = ? GROUP BY FECHA;';
    
    }else if(tipo==="Ubicacion"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE U.ID = ? GROUP BY FECHA;';
    
    }

    if(id===undefined || consulta==='' || tipo===undefined){
        res.send({error : "Problema con los datos tipo y id"});
        return
    }

    pool.query(consulta,[id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
}); 



module.exports = router;