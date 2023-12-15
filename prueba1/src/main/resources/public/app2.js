
const seccion = document.querySelector('#respuesta');

const bloques = document.querySelector('#bloquescaminos');

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


const traerUrl = new URLSearchParams(window.location.search);
id = traerUrl.get('id');
console.log(id);
const url = './piramide/';

fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(data => {
        var h1 = document.querySelector('#titulo')
        var p = document.createElement("p")
        p.innerHTML = `PIR&Aacute;MIDE DE NIVEL ${data.value.datos.tamano}`
        h1.appendChild(p)
        a = data.value.datos.arreglo
        s = data.value.datos.solucion
        console.log(typeof a, s)
        seccion.innerHTML = dibujarPiramide(a, s)
        bloques.innerHTML = dibujarCamino(s)

    })
    .catch(error => console.log(error))

