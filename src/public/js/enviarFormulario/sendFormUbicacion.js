
const button = document.getElementById('enviar');

button.addEventListener('click', async (e)=>{
    e.preventDefault();
    
    let nombre = document.getElementById("Nombre").value;
    const data = {nombre};

    const res = await fetch('/addUbicacion', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const exito = await res.text();

    alert(exito);

    window.location.href = '/addUbicacion'
})  
