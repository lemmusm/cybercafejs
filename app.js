
// Declarar variables
const formularioUI = document.querySelector('#formulario');
const listaUsuariosUI = document.querySelector('#listaUsuarios');
const limpiarUI = document.querySelector('#limpiarCache');

let arrayUsuarios = [];
// Funciones
CrearUsuario = usuario => {

    usuario = {
        usuario: usuario,
        inicio: moment().format('hh:mm:ss a'),
        inicioTiempo: moment().format('DD/MM/YYYY HH:mm:ss'),
        fin: '0',
        finTiempo: '0',
        tiempo: '0',
        tarifa: '0'
    };
    arrayUsuarios.push(usuario);

    return usuario;
}

GuardarUsuario = () => {
    localStorage.setItem('usuarios', JSON.stringify(arrayUsuarios));
    MostrarData();
}

MostrarData = () => {

    listaUsuariosUI.innerHTML = '';

    arrayUsuarios = JSON.parse(localStorage.getItem('usuarios'));

    if (arrayUsuarios === null) {
        arrayUsuarios = []
    } else {
        arrayUsuarios.forEach(data => {
            listaUsuariosUI.innerHTML += `
                <tr>
                    <td>${data.usuario} </td>
                    <td>${data.inicio}</td>
                    <td>${data.fin}</td>
                    <td>${data.tiempo}</td>
                    <td>$ ${data.tarifa}.00 MXN</td>
                    <td>
                        <button class='btn btn-sm btn-success mr-2' id='tiempo'>
                            Finalizar
                        </button>

                        <button class='btn btn-sm btn-danger ml-2' id='borrar'>
                            Borrar
                        </button>
                    </td>
                </tr>`
        });
    }
}

checarTiempo = (usuario) => {
    //Encuentra el index del array
    let indexArray = arrayUsuarios.findIndex(
        // (elemento) => elemento.usuario === usuario
        (elemento) => {
            return elemento.usuario === usuario
        }
    );


    arrayUsuarios[indexArray].fin = moment().format('hh:mm:ss a');
    arrayUsuarios[indexArray].finTiempo = moment().format('DD/MM/YYYY HH:mm:ss');
    GuardarUsuario();

    usuarios = JSON.parse(localStorage.getItem('usuarios'));
    inicio = usuarios[indexArray].inicioTiempo;
    fin = usuarios[indexArray].finTiempo;

    finDateObj = new Date(fin);
    inicioDateObj = new Date(inicio);

    let finDateMoment = moment(finDateObj)
    let inicioDateMoment = moment(inicioDateObj)

    diferencia = moment.duration(finDateMoment.diff(inicioDateMoment));
    final = diferencia.hours() + ' horas ' + ' : ' + diferencia.minutes() + ' minutos ';
    minutosTotales = diferencia.hours() * 60 + diferencia.minutes();
    arrayUsuarios[indexArray].tiempo = final;

    // Formula para obtener costo
    costo = minutosTotales * 8 / 60;
    // Asigna valor a elemento tarifa del objeto usuario
    arrayUsuarios[indexArray].tarifa = Math.ceil(costo);

    // Guarda valores
    GuardarUsuario();

}

// Elimina usuario de local storage
eliminarUsuario = (usuario) => {
    let indexArray;
    arrayUsuarios.forEach((item, index) => {

        if (item.usuario === usuario) {
            indexArray = index;
        }

    });

    arrayUsuarios.splice(indexArray, 1);
    GuardarUsuario();
}
// EVENTLISTENER

formularioUI.addEventListener('submit', (e) => {
    e.preventDefault();
    let usuarioUI = document.querySelector('#nombreUsuario').value;

    CrearUsuario(usuarioUI);
    GuardarUsuario();

    formularioUI.reset();
})
// Mostrar datos
document.addEventListener('DOMContentLoaded', MostrarData)

//

listaUsuariosUI.addEventListener('click', (e) => {
    e.preventDefault();

    const accion = e.target.innerText;
    const accionFinal = e.path[2].childNodes[1].innerText;

    if (accion === 'Finalizar' || accion === 'Borrar') {

        switch (accion) {
            case 'Finalizar':
                checarTiempo(accionFinal);
                break;

            case 'Borrar':
                eliminarUsuario(accionFinal);
                break;
        }
    }
});


// btnTiempo.addEventListener('click', (e) => {
//     console.log(e)
// })

// Limpiar cache localstorage
limpiarUI.addEventListener('click', (e) => {
    localStorage.clear();
    MostrarData();
});
