const button = document.getElementById('Buscar');

const select = document.getElementById("selectBusqueda");

select.addEventListener('change', (event)=>{
    console.log(event.target.value)
    const div = document.getElementById('campos')

    if(event.target.value==='2'){
        div.innerHTML = `<div class="form-group">
            <label for="Tipo">Ingrese número</label>
            <input type="number" id="min" placeholder="Número Minimo" class="form-control" autocomplete="off" min="0">
        </div>
        <div class="form-group">
            <label for="Tipo">Ingrese número</label>
            <input type="number" id="max" placeholder="Número Maximo" class="form-control" autocomplete="off" min="0">
        </div>  `
    }else if(event.target.value==='1'){
        div.innerHTML = `<div class="form-group">
            <label for="Tipo">Ingrese número</label>
            <input type="number" id="numero" placeholder="Número de Producto" class="form-control" autocomplete="off" min="0">
        </div>`
    }else if(event.target.value==='*'){
        div.innerHTML = '';
    }
});

//Al momento de hacer click en el boton Buscar se obtendrá el tipo de categoria y se hará un fetch para obtener sus datos
button.addEventListener('click', async (e) => {
    e.preventDefault();
    const selectBusqueda = document.getElementById("selectBusqueda");
    const valor = selectBusqueda.options[selectBusqueda.selectedIndex].value;
    
    const data = {tipo:'', id:'', idMin:'', idMax:''}
    //accion buscar para cada opcion del select
    if(valor==='1'){
        const numero = document.getElementById('numero');

        //validar que el elemento  no es vacio
        if(numero.value===''){
            alert('ingrese un número');
            return;
        }
        const n = parseInt(numero.value);
        data.tipo = 1;
        data.id = n;
    }else if(valor==='2'){
        const min = document.getElementById('min');
        const max = document.getElementById('max');

        const nMin = parseInt(min.value);
        const nMax = parseInt(max.value);

        //validar rangos           
        if(max.value ==="" && min.value===""){
            alert('Ingrese los 2 rangos');
            return;
        }else if(nMin>nMax){
            alert('Número minimo es mayor al numero Maximo');
            return;
        }
        data.tipo = 2;
        data.idMin = nMin;
        data.idMax = nMax;

    }else if(valor==='*'){
        alert('Selecione una opcion');
        return;
    }

    let params = '';
    if(valor==='1'){
        console.log(data);
        params = new URLSearchParams({tipo: data.tipo, id : data.id })
    }else{
        params = new URLSearchParams({tipo: data.tipo, idMin : data.idMin, idMax: data.idMax});
    }
    //pedir productos de la categoria pasada por parametros
    console.log("parasm", params.toString())
    const response = await fetch('/getProductosPorId/?'+ params.toString());
    const productos =  await response.json();

    
    class Table{
        
        static getTable(datos){
            const keys = Object.keys(datos[0]);
            const TableStyle = 'd-flex justify-content-center table table-responsive text-center table-bordered'
            const TheadStyle = 'thead-dark'

            
            return(`<table class='${TableStyle}'><thead class='${TheadStyle}' ><tr>${keys.map(e => `<th>${e}</th>`).join('')} </tr>${addRow(datos)}</thead></table>`)
        }
        static addRow(data) {
            return data.map( rowDic =>`<tr>${Object.values(rowDic).map( dataRow => `<td>${dataRow}</td>`).join('')}</tr>`).join('');
        }
    }
    
    const div = document.getElementById('tabla');
    div.innerHTML = Table.getTable(productos);
    
    
});

//     //Valirdar que no esté vacio el dato
//     if (valor === '-') {
//         alert('ingrese un Tipo antes de buscar');
//         return;
//     }

//     //validar que el dato sea correcto
//     if(!(valor==="Especie" || valor==="Rubro" || valor==="Persona" || valor==="Ubicacion")){
//         alert('dato ingresado no es valido para realizar la consulta');
//         return
//     }

//     //obtener datos de esa categoría especifica
//     //No sé si esto es una mala practica
//     const url = '/get' + valor;
//     const res = await fetch(url);
//     const filasDeCategoria = await res.json();

//     rederizarFilasDeCategorias(filasDeCategoria, valor);

// });

// const rederizarFilasDeCategorias = (data, tipo) => {

//     const div = document.getElementById('tabla');
//     div.innerHTML = `<table id="table" class="row d-flex justify-content-center table table-responsive text-center table-bordered">
//             <thead id="thead" class="thead-dark">
//                 <tr>
//                     <th scope="col">${(tipo==="Persona")? "RUT":"id"}</th>
//                     <th scope="col">Nombre</th>
//                     <th scope="col">Buscar sus Productos</th>
//                 </tr>
//             </thead>
//         </table>`;
//     const table = document.getElementById('table');
    
//     for (let i = 0; i < data.key.length; i++) {
//         const idRow = data.key[i];
//         const textRow = data.text[i];
//         const Newrow = table.insertRow(-1);
//         Newrow.insertCell(0).textContent = idRow;
//         Newrow.insertCell(1).textContent = textRow;
//         const cell = Newrow.insertCell(2)
//         cell.innerHTML = `<button class="btn-btn button">Buscar</button>`;
//         cell.children[0].addEventListener('click', async()=>{
//             await PedirProductosDeCategoria(idRow, tipo);
//         });

//         const PedirProductosDeCategoria = async (id, tipo)=>{
            
//             const params = new URLSearchParams({id, tipo})
//             //pedir productos de la categoria pasada por parametros
//             const response = await fetch('/getProductos/?'+ params.toString());
//             const data =  await response.json();

//             if(data.error){
//                 alert('datos no encontrados');
//                 return
//             }

//             renderizarTablaProductos(data, tipo)


//         }
//         const renderizarTablaProductos = (data, tipo)=>{
//             const div = document.getElementById('tabla');
//             div.innerHTML = `<table id="table" class="row d-flex justify-content-center table table-responsive text-center table-bordered">
//                 <thead id="thead" class="thead-dark">
//                     <tr>
//                         <th scope="col">Números</th>
//                         <th scope="col">Tipo Especie</th>
//                         <th scope="col">Descripción</th>
//                         <th scope="col">Encargado</th>
//                         <th scope="col">Rubro</th>
//                         <th scope="col">Ubicación</th>
//                         <th scope="col">Cantidad</th>
//                         <th scope="col">Precio</th>
//                     </tr>
//                 </thead>
//             </table>`;

            
//             const table = document.getElementById('table');

//             for (let i = 0; i < data.length; i++) {
                
//                 const min = data[i].MIN;
//                 const max = data[i].MAX;
//                 const especie = data[i].ESPECIE;
//                 const descripcion = data[i].DESCRIPCION;
//                 const encargado = data[i].ENCARGADO;
//                 const rubro = data[i].RUBRO;
//                 const ubicacion = data[i].UBICACION;
//                 const cantidad = data[i].CANTIDAD;
//                 const precio = data[i].PRECIO;
                
//                 const filaProductoCategoria = table.insertRow(-1);
//                 filaProductoCategoria.insertCell(0).textContent = `${min} - ${max}`;
//                 filaProductoCategoria.insertCell(1).textContent = especie;
//                 filaProductoCategoria.insertCell(2).textContent = descripcion;
//                 filaProductoCategoria.insertCell(3).textContent = encargado;
//                 filaProductoCategoria.insertCell(4).textContent = rubro;
//                 filaProductoCategoria.insertCell(5).textContent = ubicacion;
//                 filaProductoCategoria.insertCell(6).textContent = cantidad;
//                 filaProductoCategoria.insertCell(7).textContent = precio;
//             }
//         }
//     }
    
// }