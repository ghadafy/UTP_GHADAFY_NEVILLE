const formulario = document.querySelector('form');

const seccion = document.querySelector('#respuesta');

const bloques = document.querySelector('#bloquescaminos');

const tarjeta = document.querySelectorAll('.filaNueva');

const historial = document.querySelector('#historial');


function arregloPiramide(filas) {

    //Generamos un arreglo con las cordenadas y el contenido para formar la piramide 
    const arreglo = new Array();
    var arreglosInternos = new Array();

    for (let i = 1; i <= filas; i++) {

        for (let j = 0; j < i; j++) {

            arreglosInternos.push(Math.floor((Math.random() * (99)) + 1));

        }

        arreglo.push(arreglosInternos);
        arreglosInternos = [];
    }

    return arreglo;
}

function dibujarPiramide(arrOrg, arrSol) {

    /*Esta area se encarga de dibujar la piramide en el HTML 
    gracias al arreglo que recibe*/
    let marcados = arrSol; //
    let dibujo = '';

    for (let i = 0; i < arrOrg.length; i++) {

        dibujo += `<div class='fila'>`;

        for (let j = 0; j <= i; j++) {

            if (marcados[1][i][0] == arrOrg[i][j] && marcados[1][i][2] == j) {

                dibujo += `<div class='celda camino'>${arrOrg[i][j]}</div > `;

            } else {

                dibujo += `<div class='celda'>${arrOrg[i][j]}</div > `;
            }

        }
        dibujo += `</div > `;
    }

    return dibujo;
}

function dibujarCamino(arrSol) {

    //Esta area se encarga de dibujar el camino solucion en el HTML 

    let marcados = arrSol;
    let camino = '';
    console.log(marcados);

    camino += `<div class='fila'>`;
    for (let i = 0; i < marcados[1].length; i++) {

        camino += `<div class='celda camino'>${marcados[1][i][0]}</div > `;

    }
    camino += `<div class='sol'>=</div><div class='sol'>${marcados[0][0]}</div></div > `;

    return camino;
}

function buscarTodosCaminoAsc(arrOrg) {

    let tamano = arrOrg.length;
    /*El arreglo baseSumatorias contiene los elementos de la base para luego terminar ir acumulando el valor de los caminos seguidos*/
    const baseSumatorias = [];
    const nuevoValorPostInicial = [];
    const datos = [];
    let fila = 0;
    let columna = 0;
    const mejorCamino = [];
    /* El arreglo "seguimiento" guarda toda la informacion del recorrido de los posibles caminos con el mayor peso buscado */
    const seguimiento = [];
    /* El arreglo recorrido guarda toda la informacion del recorrido con el mayor peso buscado.
    Este es el contenido:
    [VALOR, FILA, COLUMNA, COLUMNA_DE_LA_SIGUIENTE_FILA, SUMATORIA_EN_EL_MOMENTO] 
    */
    const recorrido = new Array(tamano).fill(0);
    let indiceJ = 0;

    for (let i = 0; i < tamano; i++) {

        seguimiento[i] = new Array(tamano).fill(0);

    }

    for (let i = 0; i < tamano; i++) {

        baseSumatorias[i] = arrOrg[tamano - 1][i];
        seguimiento[tamano - 1][i] = [arrOrg[tamano - 1][i], i];

    }

    //Aqui iniciamos desde la fila anterior a la base de la piramide+
    for (let i = tamano - 2; i >= 0; i--) {

        for (let j = 0; j <= i; j++) {

            const valorInicial = arrOrg[i][j];  //Elemento de la fila ANTES de la base
            const valorIzquierdo = baseSumatorias[j];  //Elemento izquierdo anterior
            const valorDerecho = baseSumatorias[j + 1];  //Elemento derecho anterior

            if (valorDerecho >= valorIzquierdo) {

                nuevoValorPostInicial[0] = valorDerecho;
                indiceJ = j + 1;

            } else {

                nuevoValorPostInicial[0] = valorIzquierdo;
                indiceJ = j;

            }

            seguimiento[i][j] = [valorInicial + nuevoValorPostInicial[0], arrOrg[i][j], j, indiceJ]

            baseSumatorias[j] = valorInicial + nuevoValorPostInicial[0];
        }

    }

    console.log(seguimiento);

    //Aqui ingresamos los datos del arreglo recorrido
    fila = 0;
    while (fila < tamano) {

        columna = 0;
        while (columna <= fila) {

            if (fila == 0) {

                recorrido[fila] = [seguimiento[fila][columna][1], fila, seguimiento[fila][columna][2], seguimiento[fila][columna][3], seguimiento[fila][columna][0]];

            }

            if (fila > 0 && fila < tamano - 1 && seguimiento[fila][columna][2] == recorrido[fila - 1][3]) {

                recorrido[fila] = [seguimiento[fila][columna][1], fila, seguimiento[fila][columna][2], seguimiento[fila][columna][3], seguimiento[fila][columna][0]];

            }

            if (fila == tamano - 1 && seguimiento[fila][columna][1] == recorrido[fila - 1][3]) {

                recorrido[fila] = [seguimiento[fila][columna][0], fila, seguimiento[fila][columna][1], 0, 0];

            }
            columna++;
        }
        fila++;
    }

    datos[0] = baseSumatorias;
    datos[1] = recorrido;
    console.log("Recorrido", recorrido);
    return datos;  //Resultado las columnas [NUM, FILA, COLUMNA, CONECTOR, SUMATORIA] 
}

function enviarDatos(miarreglo, matrizSol) {

    const url = "/piramide";
    const datos = {
        "tamano": miarreglo.length,
        "arreglo": miarreglo,
        "solucion": matrizSol
    };


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ datos }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("PiramideEnviada: ", data)
        })

        .catch(error => console.error('Error:', error));


}

function limpiarHistorial() {
    //Aqui Elimino los nodos hijo del historial para volverlos a crear

    if (historial) {
        while (historial.firstChild) {
            historial.removeChild(historial.firstChild);
        }
    }
}

function verDatos() {
    var fragmento = document.createDocumentFragment();
    var url = '/piramides';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error('Respuesta no exitosa', error);
            }
            return response.json();
        })

        .then(data => {

            data.forEach(info => {

                var parrafo = document.createElement("p")
                var divs = document.createElement("div")
                var imagen = document.createElement("img")

                var tamano = info.fila.datos.tamano
                var sol = info.fila.datos.solucion[0][0]
                var id = info.id

                parrafo.innerHTML = `(${id + 1}) - N ${tamano} - P ${sol} `

                if (tamano == 2) {
                    imagen.src = 'imgs/nivel2.jpg'
                }
                else if (tamano == 3) {
                    imagen.src = 'imgs/nivel3.jpg'
                }
                else if (tamano == 4) {
                    imagen.src = 'imgs/nivel4.jpg'
                }
                else if (tamano == 5) {
                    imagen.src = 'imgs/nivel5.jpg'
                }
                else {
                    imagen.src = 'imgs/mayor5.jpg'
                }

                divs.classList.add("filaNueva")
                divs.setAttribute('id', id)
                ventanaNueva(id, divs)

                divs.appendChild(parrafo)
                divs.appendChild(imagen)

                fragmento.appendChild(divs)

            });
            historial.appendChild(fragmento);
        })
        .catch(error => { console.error('Error:', error) });


}


function ventanaNueva(id, etiqueta) {

    etiqueta.addEventListener('click', function (e) {


        e.preventDefault();

        id_div = id

        let urlNueva = `/piramide.html?id=${id_div}`

        var left = (window.innerWidth - 600) / 2;
        var top = (window.innerHeight - 400) / 2;

        //  bloquear.style.display = "block"

        window.open(urlNueva, "_blank", "width=600,height=400,left=" + left + ",top=" + top + ",resizable=no,scrollbars=si,location=no,menubar=no");

    }); //Aqui escuchamos el evento que abre las ventanas

}

const principal = (e) => {

    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const niveles = datos.get('niveles');
    if (niveles < 2 || niveles > 50) {
        alert("Valor no permitido...");
    }
    else {
        const arrPiramide = arregloPiramide(niveles);
        const matrizSol = buscarTodosCaminoAsc(arrPiramide);
        enviarDatos(arrPiramide, matrizSol);
        limpiarHistorial();
        verDatos();
        seccion.innerHTML = dibujarPiramide(arrPiramide, matrizSol);
        bloques.innerHTML = dibujarCamino(matrizSol);

    }
}

formulario.addEventListener('submit', principal); //Aqui escuchamos el evento