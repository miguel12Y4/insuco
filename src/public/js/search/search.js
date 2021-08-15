const button = document.getElementById('Buscar');

button.addEventListener('click', async (e) => {
    e.preventDefault();
    const myselect = document.getElementById('Tipo');
    const valor = myselect.options[myselect.selectedIndex].value;

    if (valor === '-') {
        alert('ingrese un Tipo antes de buscar');
        return;
    }

    const url = '/get' + valor;
    const res = await fetch(url);

    const data = await res.json();

    console.log(data);
    crearFuncion(data, valor)

});

const crearFuncion = (data, tipo) => {

    const div = document.getElementById('tabla');
    div.innerHTML = `<table id="table" class="row d-flex justify-content-center table table-responsive text-center table-bordered">
    <thead id="thead" class="thead-dark">
        <tr>
            <th scope="col">${(tipo==="Persona")? "RUT":"id"}</th>
            <th scope="col">Nombre</th>
          </tr>
    </thead>
  </table>`;
     
    
    data.data.forEach((element, index) => { 
        let Newrow = table.insertRow(-1);
        Newrow.insertCell(0).textContent = element;
        Newrow.insertCell(1).textContent = data.vista[index];
    });
    
}