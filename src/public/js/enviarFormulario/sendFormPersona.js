
const button = document.getElementById('enviar');

button.addEventListener('click', async (e)=>{
    e.preventDefault();
    
    let nombre = document.getElementById("Nombre").value;
    let rut = document.getElementById("rut").value;
    const data = {nombre, rut};

    const res = await fetch('/addPersona', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const exito = await res.text();

    alert(exito);

    window.location.href = '/addPersona'
})  