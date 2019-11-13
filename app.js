
// Declarar variables
const formularioUI = document.querySelector('#formulario');
const listaUsuariosUI = document.querySelector('#listaUsuarios');
const limpiarUI = document.querySelector('#limpiarCache');

let btnTiempo = document.querySelector('#tiempo');
let btnBorrar = document.querySelector('#borrar');

let arrayUsuarios = [];
// Funciones
CrearUsuario = usuario => {

    usuario = {
        usuario: usuario,
        inicio: moment().format('hh:mm:ss a'),
        inicioTiempo: new Date(),
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
                        <button class='btn btn-sm btn-success mr-2' data-id='${data.usuario}'>
                            Finalizar
                        </button>

                        <button class='btn btn-sm btn-danger ml-2' data-id='${data.usuario}' id='borrar'>
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
    arrayUsuarios[indexArray].finTiempo = new Date();
    GuardarUsuario();

    usuarios = JSON.parse(localStorage.getItem('usuarios'));
    inicio = usuarios[indexArray].inicioTiempo;
    fin = usuarios[indexArray].finTiempo;

    f = moment(fin);
    i = moment(inicio);

    diferencia = moment.duration(f.diff(i));
    final = diferencia.hours() + ' horas ' + ' : ' + diferencia.minutes() + ' minutos ';
    minutosTotales = diferencia.hours() * 60 + diferencia.minutes();
    arrayUsuarios[indexArray].tiempo = final;

    // Formula para obtener costo
    costo = minutosTotales * 10 / 60;
    
    // Asigna valor a elemento tarifa del objeto usuario
    arrayUsuarios[indexArray].tarifa = Math.ceil(costo + 1.5);

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

    const id = e.target.dataset.id;

    if (accion === 'Finalizar' || accion === 'Borrar') {

        switch (accion) {
            case 'Finalizar':
                checarTiempo(id);
                break;

            case 'Borrar':
                eliminarUsuario(id);
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
