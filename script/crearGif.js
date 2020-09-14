//variables botones
let btnComenzar = document.getElementById("btn-creargifo-comenzar");
let btnGrabar = document.getElementById('btn-creargifo-grabar');
let btnFinalizar = document.getElementById('btn-creargifo-finalizar');
let btnSubirGifo = document.getElementById('btn-creargifo-subirgifo');
let apiKey = "RUpoxf7EHQzQ8ZBbGKJWDXMoQabiTrQq";

//Acciones botones
btnComenzar.addEventListener("click", comenzarCreacionGifo)

//variables
let pasoActivo = document.querySelectorAll('#creargifo-pasos-numero');
let videoGif = document.getElementById('grabacion-video');
let recorder;
let tiempoGrabacion = document.getElementById('contador-grabacion');
let repetirCaptura = document.getElementById('contador-repetircaptura');
let dateStarted;
let gifGrabado = document.getElementById('gif-grabado');
let blob;
let form = new FormData();

let overlayCargando = document.getElementById('overlay-video');
let accionesCargando = document.getElementById('overlay-video-actions');
let iconoCargando = document.getElementById('overlay-video-icon');
let textoCargando = document.getElementById('overlay-video-parrafo');
let overlayActions = document.getElementById('overlay-video-actions');
let misGifosArray = [];
let misGifosString = localStorage.getItem("misGifos");

//Camara
function comenzarCreacionGifo() {

    btnComenzar.style.display = "none";
    //Modificar titulo y textos
    let tituloGrabar = document.getElementById('titulo-grabargifo');
    let textoGrabar = document.getElementById('texto-grabargifo');
    tituloGrabar.innerHTML = "¿Nos das acceso </br>a tu cámara?";
    textoGrabar.innerHTML = "El acceso a tu camara será válido sólo </br>por el tiempo en el que estés creando el GIFO."

    //Activar paso 1 con relleno
    pasoActivo[0].classList.add('paso-activo');

    //Solicitar permiso camara
    navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 480, height: 320 } })
                //Mostrar camara y el boton GRABAR
                .then(function (stream) {
                    //borro el texto
                    tituloGrabar.style.display = "none";
                    textoGrabar.style.display = "none";
                    btnGrabar.style.display = "block";
                    //Activar relelno paso 2
                    pasoActivo[0].classList.remove('paso-activo');
                    pasoActivo[1].classList.add('paso-activo');
                    
                    //aparece el video
                    videoGif.style.display = "block";
                    videoGif.srcObject = stream;
                    videoGif.onloadedmetadata = function (e) {
                        videoGif.play();
                    };
                    recorder = RecordRTC(stream, {
                        type: 'gif'
                    });
                })
}

//Grabar
btnGrabar.addEventListener('click', grabarGifo);

function grabarGifo() {
    ///Empezar a grabar
    recorder.startRecording();
    console.log("grabando gif");

    btnGrabar.style.display = "none";
    btnFinalizar.style.display = "block";

    tiempoGrabacion.style.display = "block";
    repetirCaptura.style.display = "none";

    dateStarted = new Date().getTime();

    (function looper() {
        if (!recorder) {
            return;
        }
        tiempoGrabacion.innerHTML = calcularTiempo((new Date().getTime() - dateStarted) / 1000);
        setTimeout(looper, 1000);
    })();

}
//Calcular el tiempo
function calcularTiempo(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return hr + ':' + min + ':' + sec;
}

// Terminar
btnFinalizar.addEventListener('click', finalizarGifo);

function finalizarGifo() {

    console.log("gif terminado");

    btnFinalizar.style.display = "none";
    btnSubirGifo.style.display = "block";

    tiempoGrabacion.style.display = "none";
    repetirCaptura.style.display = "block";

    
    recorder.stopRecording(function () {
        videoGif.style.display = "none";
        gifGrabado.style.display = "block";

        blob = recorder.getBlob();
        gifGrabado.src = URL.createObjectURL(recorder.getBlob());

        form.append('file', recorder.getBlob(), 'myGif.gif');
        form.append('api_key', apiKey);
    });
    
}

//Subir gifo
btnSubirGifo.addEventListener('click', subirGifo);
function subirGifo() {

    //Pantalla de carga de gif
    overlayCargando.style.display = "flex";
    btnSubirGifo.style.display = "none";
    //Rellenar pasos
    pasoActivo[1].classList.remove('paso-activo');
    pasoActivo[2].classList.add('paso-activo');
    repetirCaptura.style.display = "none";

    //subir gifs a Ghypy
    fetch(`https://upload.giphy.com/v1/gifs`, {
        method: 'POST',
        body: form,
    })

        .then(response => {
            return response.json();
        })

        //Mostrar mensaje de cargue de gif
        .then(objeto => {
            console.log("datos objeto"+ objeto);
            console.log(objeto);
            let miGifId = objeto.data.id;
            console.log(miGifId);
            //Subida del gif
            accionesCargando.style.display = "block";
            iconoCargando.setAttribute("src", "./assets/check.svg");
            textoCargando.innerText = "GIFO subido con éxito";
            overlayActions.innerHTML = `
                <button class="overlay-video-button" id="btn-creargifo-descargar" onclick="descargarGifCreado('https://media4.giphy.com/media/${miGifId}/giphy.gif?cid=7876023df4951d710c0d9daa596f5f38d2baa565d9f07cdd&rid=giphy.gif')">
                <img src="./assets/icon-download.svg" alt="download">
                </button>
                <button class="overlay-video-button" id="btn-creargifo-link">
                <a href='https://media4.giphy.com/media/${miGifId}/giphy.gif?cid=7876023df4951d710c0d9daa596f5f38d2baa565d9f07cdd&rid=giphy.gif' target="_blank"><img src="./assets/icon-link.svg" alt="link"></a>
                </button>
                `;

            if (misGifosString == null) {
                misGifosArray = [];

            } else {
                //Agregar a mis gifos
                misGifosArray = JSON.parse(misGifosString);
            }
            misGifosArray.push(miGifId);
            misGifosString = JSON.stringify(misGifosArray);
            localStorage.setItem("misGifos", misGifosString);
        })
        .catch(error => console.log("error al subir gif a GIPHY" + error))
}
//Repetir captura
repetirCaptura.addEventListener('click', repetirCapturaGifo);

function repetirCapturaGifo() {
    recorder.clearRecordedData();
    console.log("re-grabando gif");
    //Ocultar repetir captura
    repetirCaptura.style.display = "none";
    //Ocultar boton subir
    btnSubirGifo.style.display = "none";
    //Ocultar boton grabando
    gifGrabado.style.display = "none";
    //Mostrar grabar
    btnGrabar.style.display = "block";
    //Activar camara
    navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 480, height: 320 } })
        .then(function (stream) {
            //Mostrar video
            videoGif.style.display = "block";
            videoGif.srcObject = stream;
            videoGif.onloadedmetadata = function (e) {
                videoGif.play();
            };
            recorder = RecordRTC(stream, {
                type: 'gif'
            });
        })
}
//Descargar gif
async function descargarGifCreado(gifImg) {
    let blob = await fetch(gifImg).then( img => img.blob());;
    invokeSaveAsDialog(blob, "migifo.gif");
}

