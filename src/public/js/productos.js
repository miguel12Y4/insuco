class producto {
    constructor(nul = false, descripcion, precio, cantidad, observacion, especie, rubro, ubicacion, encargado) {
        this.nul = nul;
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
        this.observacion = observacion;
        this.especie = especie;
        this.rubro = rubro;
        this.ubicacion = ubicacion;
        this.encargado = encargado;
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
        let prod = []
        this.productos.forEach(element => {
            if (!element.nul) {
                prod.push(element)
            }
        });
        return prod;
    }
    borrarProducto(index) {
        this.productos[index] = new producto(true);
    }
}

const form = document.getElementById('product-form');
var ui = new UI();

//Eliminar de la tabla la fila selecionada y quitarla del registro de ui
function deleteRow(path, index) {
    ui.borrarProducto(index);
    path[3].removeChild(path[2]);
}


//obtiene los datos del formulario, los agrega a la tabla y los agrega al array de productos de ui
const guardarProdcutos = () => {

    //obtener y  validad información de formulario
    let descripcion = document.getElementById("descripcion").value;
    let precio = document.getElementById("precio").value;
    let observacion = document.getElementById("observacion").value;
    let cantidad = document.getElementById("cantidad").value;

    let selectEspecie = document.getElementById("selectEspecie").value;
    selectEspecie = (selectEspecie == "Especie" ? "-" : selectEspecie);

    let selectRubro = document.getElementById("selectRubro").value;
    selectRubro = (selectRubro == "Rubro" ? "-" : selectRubro);

    let selectUbicacion = document.getElementById("selectUbicacion").value;
    selectUbicacion = (selectUbicacion == "Ubicacion" ? "-" : selectUbicacion);

    let selectPersona = document.getElementById("selectPersona").value;
    selectPersona = (selectPersona == "Encargado" ? "-" : selectPersona);

    //comprobar validez de los datos
    if (descripcion === "" || precio === "" || cantidad === "") {
        alert("Faltan datos que completar");
        return;
    }

    //insertar datos a la tabla
    let tabla = document.getElementById('table');
    let newRow = tabla.insertRow(-1);

    let cell = newRow.insertCell(0);
    cell.innerHTML = '<strong>' + descripcion + '</strong>';

    cell = newRow.insertCell(1);
    cell.textContent = precio;

    cell = newRow.insertCell(2);
    cell.textContent = cantidad;


    cell = newRow.insertCell(3);
    cell.textContent = (selectEspecie);

    cell = newRow.insertCell(4);
    cell.textContent = selectRubro;

    cell = newRow.insertCell(5);
    cell.textContent = selectUbicacion;

    cell = newRow.insertCell(6);
    cell.textContent = selectPersona;

    cell = newRow.insertCell(7);
    cell.textContent = observacion;


    let index = ui.agregarProducto(new producto(false, descripcion, precio, cantidad, observacion, selectEspecie, selectRubro, selectUbicacion, selectPersona));

    cell = newRow.insertCell(8);
    cell.innerHTML = '<button class="btn btn-danger p-0">Borrar</button>'
    cell.addEventListener('click', (event) => {
        deleteRow(event.path, index);
    })
}

//añadir accion al formulario, al momento de hacer click agregará una fila a la tabla
form.addEventListener('submit', function (event) {
    event.preventDefault();
    guardarProdcutos();

});

//enviar datos

const button = document.getElementById("enviar");

const mostrarListadoAgregado = (productos) => {
    const app = document.getElementById('App');
    const inicio = `
    <div class="mx-auto p-4 row">
        <table id="table" class="table table-responsive text-center">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Especie</th>
                    <th scope="col">Rubro</th>
                    <th scope="col">Ubicacion</th>
                    <th scope="col">Encargado</th>
                </tr>
            </thead>
            <tbody>`

    let rows = "";
    const p = productos.productos;
    p.forEach(data => {
        rows += `<tr>
            <td>${data.id}</td>
            <td>${data.descripcion}</td>
            <td>${data.especie}</td>
            <td>${data.rubro}</td>
            <td>${data.ubicacion}</td>
            <td>${data.encargado}</td>
        </tr>`
    });
    const fin = `
            </tbody>
        </table>
        <div class="container text-center" >
        <form action="/" method="get">
                <button class="btn btn-success">Inicio</button>
            </form>

    </div>
    </div>
    `;

    app.innerHTML = inicio + rows + fin;
}


button.addEventListener('click', async () => {
    const productos = ui.getProductos();

    if (productos.length > 0) {
        let url = 'http://localhost:2002/addProduct';
        let data = { productos };


        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const products = await res.json();
        mostrarListadoAgregado(products);



    } else {
        alert("No hay productos en la tabla")
    }
});




