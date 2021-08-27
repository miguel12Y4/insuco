const button = document.getElementById('Buscar');

const select = document.getElementById("selectBusqueda");

select.addEventListener('change', (event)=>{
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
        params = new URLSearchParams({tipo: data.tipo, id : data.id })
    }else{
        params = new URLSearchParams({tipo: data.tipo, idMin : data.idMin, idMax: data.idMax});
    }
    //pedir productos de la categoria pasada por parametros
    const response = await fetch('/getProductosPorId/?'+ params.toString());
    const productos =  await response.json();

    
    class Table{
        // obtiene y agrega botones al div "pagina" que rendericen 10 rows por cada boton
        static getBotones(data){

            //crear un string con el codigo HTML de una tabla cuyo array esta pasado por parametros
            const getTable = (datos)=>{
                let keys;
                try {
                    keys = Object.keys(datos[0]);
                } catch (error) {
                    alert('No hay productos con ese Número');
                    return '';
                }
                const TableStyle = 'table table-responsive text-center table-bordered table-hover';
                const TheadStyle = 'thead-dark';
                
                return(`<table class='${TableStyle}'><thead class='${TheadStyle}' ><tr>${keys.map(e => `<th>${e}</th>`).join('')} </tr></thead><tbody>${addRow(datos)}</tbody></table>`);
            }
    
            //string con las filas de cada producto
            const addRow  = (data)=>{
                return data.map( rowDic =>`<tr>${Object.values(rowDic).map( dataRow => `<td>${(dataRow === null)?"":dataRow}</td>`).join('')}</tr>`).join('');
            };
    

            //creo elementos button y que modifican en div "tabla" para que al pulsar el boton i muestra 10 rows 
            const tablePaginada = (data) =>{
                let number = parseInt( data.length / 10);
                number+= data.length % 10 >0?1:0;
                let botones = []
                
                const divTabla = document.createElement('div');
                
                for (let i = 0; i < number; i++) {
                    let rows = [];
                    let btn = document.createElement('button');
                    btn.textContent = i+1;
                    for (let j = i*10; j < i*10 + 10 && j<data.length; j++) {
                        rows.push(data[j]);
                    }
                    btn.addEventListener('click', ()=>{
                        divTabla.innerHTML = getTable(rows);
                    })
                    if(i===0){
                        divTabla.innerHTML = getTable(rows);
                    }
                    botones.push(btn);
                }
                const divPadre = document.createElement('div');
                const divBotones = document.createElement('div');
                            
                botones.forEach(element => {
                    divBotones.appendChild(element);
                });

                divBotones.classList.add('text-center');
                divTabla.classList.add('container');
                divPadre.appendChild(divBotones);
                divPadre.appendChild(divTabla);
                return divPadre;
            }

            return tablePaginada(data)


        }

    }

    const t = document.querySelector('#tabla');

    if(productos.length === 0){
        alert('no se encontraron productos')
        return
    }
    
    const tabla = Table.getBotones(productos)
    //'borro' de productos de la tabla (si es que habia antes)
    t.innerHTML = '';
    //agrego los productos que corresponden a la tabla
    t.appendChild(tabla);
    
    
    
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