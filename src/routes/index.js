const express = require('express');

const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index', {title: 'Inventario insuco'})
});

router.get('/addProduct', (req, res)=>{
    res.render('addProducto', {
        title: 'Inventario insuco', 
        especies : [
            "especie1", "especie2", "especie3"
        ],
        rubros: [
            "rubro1", "rubro2", "rubro3"
        ],
        ubicaciones: [
            "ubicacion1", "ubicacion2", "ubicacion3"
        ],
        personas : [
            "persona1", "persona2", "persona3"
        ]
    })
});

router.post('/addProduct', (req, res)=>{
    const {productos} = req.body;
    var j = 0;
    const productosIndividuales = []
    productos.forEach(element => {
        for(let i = 0 ; i< element.cantidad; i++){
            productosIndividuales.push(
                {
                    id: j++,
                    descripcion: element.descripcion,
                    especie: element.especie,
                    rubro: element.rubro,
                    ubicacion: element.ubicacion,
                    encargado: element.encargado,
                }
            );
        }
    });
    
    res.send({productos: productosIndividuales});
});


module.exports = router;