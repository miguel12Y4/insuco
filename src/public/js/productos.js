const llenarFormulario = ()=>{

    addDataToFormulaio('Ubicacion');
    addDataToFormulaio('Persona');
    addDataToFormulaio('Rubro');
    addDataToFormulaio('Especie'); 
}
const addDataToFormulaio = async (tipo) =>{
    const select = document.getElementById("select"+tipo);

    const data = await peticion(tipo);

    for (let i = 0; i < data.key.length; i++) {
        const key = data.key[i];
        const text = data.text[i];
        const option = document.createElement('option');
        option.value = key;
        option.text = text;

        select.appendChild(option);
    }
    
};

const peticion = async (tipo) =>{
    const url = '/get'+tipo;
    const res = await fetch(url);
    const result = await res.json();
    return result;
};  

//busco los datos del formulario

llenarFormulario();





class producto {
    constructor(descripcion, precio, cantidad, observacion, especie, rubro, ubicacion, encargado, fecha) {
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
        this.observacion = observacion;
        this.especie = especie;
        this.rubro = rubro;
        this.ubicacion = ubicacion;
        this.encargado = encargado;
        this.fecha = fecha;
    }
}

// interfaz para guardar los productos que se estan agregando en la pantalla para luego enviarlos al backend
class UI {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        return this.productos.length - 1;
    }
    getProductos() {
        return this.productos;
    }
    borrarProducto(index) {
        this.productos.splice( index, 1 );      
    }
}


const form = document.getElementById('product-form');
var ui = new UI();


//añadir accion al formulario, al momento de hacer click agregará una fila a la tabla
form.addEventListener('submit', function (event) {
    event.preventDefault();
    guardarProdcutos();
    
});

//obtiene los datos del formulario, los agrega a la tabla y los agrega al array de productos de ui
const guardarProdcutos = () => {
    
    //obtener y  validad información de formulario
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const observacion = document.getElementById("observacion").value;
    const cantidad = document.getElementById("cantidad").value;
    
    //comprobar validez de los datos
    if (descripcion === "" || precio === "" || cantidad === "") {
        alert("Los campos Descripcion, Cantidad y Precio deben estan llenados");
        return;
    }
    //!!!cambiar los getElementId por Query selector data-
    
    //obtener data de los select
    const selectEspecie = document.getElementById("selectEspecie");
    //data para insertar a la tabla
    
    const dataTableEspecie = (selectEspecie.options[selectEspecie.selectedIndex].value == "*" ? "" : selectEspecie.options[selectEspecie.selectedIndex].text);
    //data para insertar en clase ui
    const dataEspecie = (selectEspecie.options[selectEspecie.selectedIndex].value == "*" ? null : selectEspecie.options[selectEspecie.selectedIndex].value);;
    
    const selectRubro = document.getElementById("selectRubro");
    //data para insertar a la tabla
    const dataTableRubro = (selectRubro.options[selectRubro.selectedIndex].value == "*" ? "" :  selectRubro.options[selectRubro.selectedIndex].text);
    //data para insertar en clase ui
    const dataRubro = (selectRubro.options[selectRubro.selectedIndex].value == "*" ? null :  selectRubro.options[selectRubro.selectedIndex].value);;
    
    const selectUbicacion = document.getElementById("selectUbicacion");
    //data para insertar a la tabla
    const dataTableUbicacion = (selectUbicacion.options[selectUbicacion.selectedIndex].value == "*" ? "" : selectUbicacion.options[selectUbicacion.selectedIndex].text);
    //data para insertar en clase ui
    const dataUbicacion = (selectUbicacion.options[selectUbicacion.selectedIndex].value == "*" ? null : selectUbicacion.options[selectUbicacion.selectedIndex].value);
    
    const selectPersona = document.getElementById("selectPersona");
    //data para insertar a la tabla
    const dataTablePersona = (selectPersona.options[selectPersona.selectedIndex].value == "*" ? "" : selectPersona.options[selectPersona.selectedIndex].text);
    //data para insertar en clase ui
    const dataPersona = (selectPersona.options[selectPersona.selectedIndex].value == "*" ? null : selectPersona.options[selectPersona.selectedIndex].value);
    
    
    //insertar datos a la tabla
    
    const tabla = document.getElementById('table');
    const newRow = tabla.insertRow(-1);
    
    let cell = newRow.insertCell(0);
    cell.innerHTML = '<strong>' + descripcion + '</strong>';
    
    cell = newRow.insertCell(1);
    cell.textContent = precio;
    
    cell = newRow.insertCell(2);
    cell.textContent = cantidad;
    
    
    cell = newRow.insertCell(3);
    cell.textContent = dataTableEspecie;
    
    cell = newRow.insertCell(4);
    cell.textContent = dataTableRubro;
    
    cell = newRow.insertCell(5);
    cell.textContent = dataTableUbicacion;
    
    cell = newRow.insertCell(6);
    cell.textContent = dataTablePersona;
    
    cell = newRow.insertCell(7);
    cell.textContent = observacion;
    
    const fecha = (new Date()).getTime();
    
    
    let index = ui.agregarProducto(new producto(descripcion, precio, cantidad, observacion, dataEspecie, dataRubro, dataUbicacion, dataPersona, fecha));
    
    cell = newRow.insertCell(8);
    cell.innerHTML = '<button class="btn btn-danger p-0"> X </button>'

    cell.lastElementChild.addEventListener('click', (event) => {
        deleteRow(event.path, index);
    });
}

//Eliminar de la tabla la fila selecionada y quitarla del registro de ui
function deleteRow(path, index) {

    ui.borrarProducto(index);
    
    //path[0]=button, path[1]=td, path[2]=tr, path[3]=th 
    //elimino el tr de la tabla
    path[3].removeChild(path[2]);
}

//enviar datos
const button = document.getElementById("enviar");

button.addEventListener('click', async () => {
    const productos = ui.getProductos();

    if (productos.length > 0) {
        let url = '/addProduct';
        let data = { productos };
        console.log(data)


        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resId = await res.json();
        if(resId.error){
            alert(resId.error);
            return
        }
        mostrarListadoAgregado(resId.ids);



    } else {
        alert("No hay productos en la tabla")
    }
});

const mostrarListadoAgregado = (idsFromServer) => {
    //idsFromServer string con rangos que manda el servidor

    const table = document.getElementById('table');
    
    //remover formulario
    document.getElementById('div-formulario').parentNode.removeChild(document.getElementById('div-formulario'));
    
    //clase para que la tabla este al centro
    document.getElementById('div-tabla').setAttribute("class", "row col-md-12");
    
    const rows = table.rows;

    //agrego la columna id
    rows[0].cells[8].textContent = "Números de id";

    for (let i=1; i<rows.length; i++){
        //itero por las columnas para pintar los rangos de cantidades
        rows[i].cells[8].textContent = idsFromServer[i-1];
        
    }

    let divEnviar = document.getElementById("div-enviar");
    
    divEnviar.innerHTML = '<a href="/addProduct" class="btn btn-success">Volver</a>'

}

