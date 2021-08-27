const button = document.getElementById('Buscar');


//Al momento de hacer click en el boton Buscar se obtendrá el tipo de categoria y se hará un fetch para obtener sus datos
button.addEventListener('click', async (e) => {
    e.preventDefault();

    const myselect = document.getElementById('Tipo');
    const valor = myselect.options[myselect.selectedIndex].value;

    //Valirdar que no esté vacio el dato
    if (valor === '-') {
        alert('ingrese un Tipo antes de buscar');
        return;
    }

    //validar que el dato sea correcto
    if(!(valor==="Especie" || valor==="Rubro" || valor==="Persona" || valor==="Ubicacion")){
        alert('dato ingresado no es valido para realizar la consulta');
        return
    }

    //obtener datos de esa categoría especifica
    //No sé si esto es una mala practica
    const url = '/get' + valor;
    const res = await fetch(url);
    const filasDeCategoria = await res.json();

    rederizarFilasDeCategorias(filasDeCategoria, valor);

});

const rederizarFilasDeCategorias = (data, tipo) => {

    const div = document.getElementById('tabla');
    div.classList.remove('container')
    div.innerHTML = `<table id="table" class="table table-responsive text-center table-bordered m-4">
            <thead id="thead" class="thead-dark">
                <tr>
                    <th scope="col">${(tipo==="Persona")? "RUT":"id"}</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Buscar sus Productos</th>
                </tr>
            </thead>
        </table>`;
    const table = document.getElementById('table');
    
    for (let i = 0; i < data.key.length; i++) {
        const idRow = data.key[i];
        const textRow = data.text[i];
        const Newrow = table.insertRow(-1);
        Newrow.insertCell(0).textContent = idRow;
        Newrow.insertCell(1).textContent = textRow;
        const cell = Newrow.insertCell(2)
        cell.innerHTML = `<button class="btn-btn button">Buscar</button>`;
        cell.children[0].addEventListener('click', async()=>{
            await PedirProductosDeCategoria(idRow, tipo);
        });

        const PedirProductosDeCategoria = async (id, tipo)=>{
            
            const params = new URLSearchParams({id, tipo})
            //pedir productos de la categoria pasada por parametros
            const response = await fetch('/getProductos/?'+ params.toString());
            const data =  await response.json();

            if(data.error){
                alert('datos no encontrados');
                return
            }

            renderizarTablaProductos(data, tipo)


        }
        const renderizarTablaProductos = (data, tipo)=>{
            const div = document.getElementById('tabla');
            div.classList.add('container')
            div.innerHTML = `<table id="table" class="row justify-content-center table table-responsive text-center table-bordered p-4">
                <thead id="thead" class="thead-dark">
                    <tr>
                        <th scope="col">Números</th>
                        <th scope="col">Tipo Especie</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Encargado</th>
                        <th scope="col">Rubro</th>
                        <th scope="col">Ubicación</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Precio</th>
                    </tr>
                </thead>
            </table>`;

            
            const table = document.getElementById('table');

            for (let i = 0; i < data.length; i++) {
                
                const min = data[i].MIN;
                const max = data[i].MAX;
                const especie = data[i].ESPECIE;
                const descripcion = data[i].DESCRIPCION;
                const encargado = data[i].ENCARGADO;
                const rubro = data[i].RUBRO;
                const ubicacion = data[i].UBICACION;
                const cantidad = data[i].CANTIDAD;
                const precio = data[i].PRECIO;
                
                const filaProductoCategoria = table.insertRow(-1);
                filaProductoCategoria.insertCell(0).textContent = `${min} - ${max}`;
                filaProductoCategoria.insertCell(1).textContent = especie;
                filaProductoCategoria.insertCell(2).textContent = descripcion;
                filaProductoCategoria.insertCell(3).textContent = encargado;
                filaProductoCategoria.insertCell(4).textContent = rubro;
                filaProductoCategoria.insertCell(5).textContent = ubicacion;
                filaProductoCategoria.insertCell(6).textContent = cantidad;
                filaProductoCategoria.insertCell(7).textContent = precio;
            }
        }
    }
    
}