
// Declarar variables
const formularioUI = document.querySelector('#formulario');
const listaUsuariosUI = document.querySelector('#listaUsuarios');
const limpiarUI = document.querySelector('#limpiarCache');

// Arreglo para guardar
let arrayUsuarios = [];

// FUNCIONES

/*  Creando usuario */
CrearUsuario = usuario => {

    // Objeto para manejar datos del usuario
    usuario = {
        usuario: usuario,
        inicio: moment().format('hh:mm:ss a'),
        inicioTiempo: new Date(),
        fin: '0',
        finTiempo: '0',
        tiempo: '0',
        tarifa: '0'
    };
    // Agregamos objeto al array
    arrayUsuarios.push(usuario);
    //Regresamos al usuario
    return usuario;
}

/*  Guarda usuario en local storage, al mismo tiempo con el método MostrarData() trae la la vista los datos guardados */
GuardarUsuario = () => {
    localStorage.setItem('usuarios', JSON.stringify(arrayUsuarios));
    MostrarData();
}

/*  Renderea los datos traidos desde localstorage, los guarda en el arrayUsuarios y los pinta mediante innerHTML en el elemento listaUsuarios*/
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

/*

    Guarda los datos de fechas, hace la diferencia entres las fechas con la librería momentjs, se realiza la lógica para obtener el costo.

*/
checarTiempo = (usuario) => {
    //Obtiene el index seleccionado del array
    let indexArray = arrayUsuarios.findIndex(
        (elemento) => {
            return elemento.usuario === usuario
        }
    );

    /*  Guarda fechas mediante momentjs */
    arrayUsuarios[indexArray].fin = moment().format('hh:mm:ss a');
    arrayUsuarios[indexArray].finTiempo = new Date();
    /*  Guarda las fechas anteriores en el array de acuerdo al index seleccionado*/
    GuardarUsuario();

    /*  Obtiene datos desde localstorage */
    inicio = arrayUsuarios[indexArray].inicioTiempo;
    fin = arrayUsuarios[indexArray].finTiempo;

    /* Convierte las fechas traidas desde localstoreage y las convierte a formato legible para momentjs */
    f = moment(fin);
    i = moment(inicio);

    /* Obtiene la diferencia entre las fechas anteriores */
    diferencia = moment.duration(f.diff(i));

    /* De la diferencia anterior se obtiene las horas y minutos */
    final = diferencia.hours() + ':' + diferencia.minutes() + ' min. ';

    /* Suma las horas y minutos para obtener minutos totales */
    minutosTotales = diferencia.hours() * 60 + diferencia.minutes();

    /* Asigna valos al elemento tiempo */
    arrayUsuarios[indexArray].tiempo = final;

    /* Obtiene el costo por el tiempo transcurrido */
    costo = minutosTotales * 10 / 60;

    /* Suma al costo dependiendo del tiempo trasncurrido */
    if (minutosTotales <= 10) {
        costo = costo + 2
    } else if (minutosTotales >= 11 || minutosTotales <= 30) {
        costo = costo + 1.5
    }

    /* Asigna valor a tarifa y el valor lo redondea al valor más próximo */
    arrayUsuarios[indexArray].tarifa = Math.round(costo);

    /* Guarda valor de tarfifa anterior */
    GuardarUsuario();

}

/* Elimina usuario del localstorage */
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

/* Crea y guarda el usuario mediante evento submit del formulario */
formularioUI.addEventListener('submit', (e) => {

    /* Mediante preventDefault() evita refrescar la página al ejecutar el evento submit */
    e.preventDefault();
    let usuarioUI = document.querySelector('#nombreUsuario').value;

    /* Ejecuta métodos */
    CrearUsuario(usuarioUI);
    GuardarUsuario();

    /* Limpia campo del formulario */
    formularioUI.reset();
})

/* Pinta los datos cuando se carga el DOM */
document.addEventListener('DOMContentLoaded', MostrarData)

/* Ejecuta las acciones finalizar o eliminar */
listaUsuariosUI.addEventListener('click', (e) => {

    /* Mediante preventDefault() evita refrescar la página al ejecutar el evento click */
    e.preventDefault();

    /* Obtiene el valor(texto) del elemento */
    const accion = e.target.innerText;

    /* Obtiene el id del por medio data-id  */
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

/*  Limpia datos del localstorage */
limpiarUI.addEventListener('click', (e) => {
    localStorage.clear();
    MostrarData();
});
