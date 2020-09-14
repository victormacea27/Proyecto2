//Boton lupa y texto de busqueda
let btnBuscar = document.getElementById("botonBuscar");
let textoBuscado = document.getElementById("busqueda");
let btnCerrar = document.getElementById("cerrar");
let valorBuscado;

//selector de etiquetas
let gifsBuscados = document.getElementById("contenidoBuscador");
let tituloResultado = document.getElementById("resultadoBuscador");
let ul = document.getElementById('gifEncontrados');



//Agregar acción a boton
textoBuscado.addEventListener("keyup", lista);
function lista() {
    //Guardar dato escrito
    let busqueda  = textoBuscado.value
    if (busqueda.length > 0) {
        let url = `https://api.giphy.com/v1/tags/related/${busqueda}?api_key=${apiKey}&limit=4&rating=g`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            //llamar función lista
            llenarLista(data);
            console.log("busqueda: "+busqueda)
        })
        .catch(err => {
            console.error('Error', err);
        })
    }else{
        ul.innerHTML = "";
    }
}
//Acción al Enter
document.getElementById("busqueda")
.addEventListener("keyup", function(event) {
event.preventDefault();
if (event.keyCode === 13) {
    var enlaceDos = event.target.innerHTML;
    console.log(enlaceDos);
    console.log("presiono enter "+textoBuscado.value)
    valorBuscado = textoBuscado.value;
    buscarGif();
}
});
//Función llenar la lista
function llenarLista(data) {
    if (textoBuscado.value != null) {
        let datoBusqueda = data.data;
        ul.innerHTML = "";
        //cambiar stylo marco si es escritorio
        if (screen.width > 1200) {
            let intro = document.getElementById('Marco');
            intro.style.height = '200px';
            let Imglupa = document.getElementById('lupa');
            Imglupa.style.display = 'none';
            let Imglupagris = document.getElementById('botonBuscarDos');
            Imglupagris.style.display = 'block';
            Imglupagris.style.marginBottom = '150px';
            valorBuscado = textoBuscado.value;
            Imglupagris.addEventListener("click", buscarGif);
            let ImgCerrar = document.getElementById('cerrar');
            ImgCerrar.style.display = 'initial';
            ImgCerrar.style.marginBottom = '150px';
        
            for (let i = 0; i < data.data.length; i++) {
                let opcion = document.createElement('li');
                let texto = document.createElement("p")
                texto.textContent = datoBusqueda[i].name;
                texto.setAttribute("id","opcionLista"+datoBusqueda[i].name)
                //Se agrega la opción de traer gif

                texto.addEventListener("click", extraerValorLista);
                let imgLupa = document.createElement('img');
                imgLupa.src = "assets/icon-search-mod-noc.svg"
                imgLupa.alt = "lupa";
                ul.appendChild(opcion);
                opcion.appendChild(imgLupa);
                opcion.appendChild(texto);
            }
        } else{
            //Busqueda en movil
            valorBuscado = textoBuscado.value;
            btnBuscar.addEventListener("click", buscarGif);
        } 
    } else {
        ul.innerHTML = "";
        ul.classList.remove("listadoGifs");
    }
}


//Función para seleccionar el valor de la lista
function extraerValorLista(evt)
{
    var enlace = evt.target.innerHTML;
    console.log(enlace);
    valorBuscado = enlace;
    if (valorBuscado != "") {
        buscarGif();
    }
}
//Busqueda
function buscarGif(){
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${valorBuscado}&limit=12`)
    .then(response => response.json())
    .then(content =>{
        //Limpiar busqueda
        valorBuscado.innerText = "";
        gifsBuscados.innerText = "";

        //Ocultar lupa gris
        let Imglupagriscerrar = document.getElementById('botonBuscarDos');
        Imglupagriscerrar.style.display = 'none';
        console.log(valorBuscado);
        //cambiar stylo marco
        if (screen.width > 1200) {
        let intro = document.getElementById('Marco');
        intro.style.height = '50px';
        let Imglupa = document.getElementById('lupa');
        Imglupa.style.display = 'initial';
        let ImgCerrar = document.getElementById('cerrar');
        ImgCerrar.style.display = 'none';
        ImgCerrar.style.marginBottom = '0px';
        }
        //Modificar titulo busqueda existente
        let tituloBusqueda = document.getElementById('tituloBusqueda');
        tituloBusqueda.textContent = valorBuscado;

        //tituloBusqueda.textContent = textoBuscado.value;
        //tituloResultado.appendChild(tituloBusqueda);
        for(let i=0; i < content.data.length; i++){
            traerBusqueda(content.data[i]);       
    }  
    ul.innerHTML = ""
    })
    .catch(err => {
        console.log(err);
     })
}

//Mostrar resultado gif
function traerBusqueda(content) {
    contenidoBuscador.innerHTML += `
                <div class="resultados-gif-box" onclick="maxGifMobile('${content.images.downsized.url}', '${content.id}', '${content.slug}', '${content.username}', '${content.title}')">
                <div class="gif-acciones-resultados">
                    <div class="iconos-acciones-gif">
                        <button class="iconos-acciones-box favorito" onclick="agregarFavoritoBusqueda('${content.id}')">
                            <img src="./assets/icon-fav-hover.svg" alt="icon-favorito" id="icon-fav-${content.id}">
                        </button>
                        <button class="iconos-acciones-box download" onclick="descargarGifos('${content.images.downsized.url}', '${content.slug}')">
                            <img src="./assets/icon-download.svg" alt="icon-dowlnoad">
                        </button>
                        <button class="iconos-acciones-box max" onclick="maxGifDesktop('${content.images.downsized.url}', '${content.id}', '${content.slug}', '${content.username}', '${content.title}')">
                            <img src="./assets/icon-max.svg" alt="icon-max">
                        </button>
                    </div>
                    <div class="textos-descripcion-gif-resultados">
                        <p class="user-gif-resultados">${content.username}</p>
                        <p class="titulo-gif-resultados">${content.title}</p>
                    </div>
                </div>
                <img src="${content.images.downsized.url}" alt="${content.id}" class="resultados-gif" >
            </div>
                `;
}

btnCerrar.addEventListener("click", cerrar);

function cerrar(){
        //Limpiar busqueda
        //cambiar stylo marco
        if (screen.width > 1200) {
        let intro = document.getElementById('Marco');
        intro.style.height = '50px';
        let Imglupa = document.getElementById('lupa');
        Imglupa.style.display = 'initial';
        let ImgCerrar = document.getElementById('cerrar');
        ImgCerrar.style.display = 'none';
        ImgCerrar.style.marginBottom = '0px';
        }
        ul.innerHTML = "";
        document.getElementById("busqueda").value = "";
}

//Modal mobile
let modalMobile = document.createElement("div");

function maxGifMobile(img, id, slug, user, title) {
    if (screen.width < 1200) {
        modalMobile.style.display = "block";
        modalMobile.innerHTML = `
        <button class="modal-btn-close" onclick="cerrarModalMobile()"><img src="./assets/button-close.svg" alt=""></button>
        <img src="${img}" alt="${id}" class="modal-gif">

        <div class="modal-bar">
            <div class="modal-textos">
                <p class="modal-user">${user}</p>
                <p class="modal-titulo">${title}</p>
            </div>
            <div>
                <button class="modal-btn" onclick="agregarFavoritoMaxMobile('${id}')"><img src="./assets/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-max-mob-${id}"></button>
                <button class="modal-btn" onclick="descargarGifos('${img}', '${slug}')"><img src="./assets/icon-download.svg" alt="download-gif"></button>
            </div>
        </div>
        `;
        modalMobile.classList.add("modal-activado");
        document.body.appendChild(modalMobile);
    }
}

function cerrarModalMobile() {
    modalMobile.style.display = "none";
}

function agregarFavoritoMaxMobile(gif){

    let iconFavMaxMobile = document.getElementById('icon-fav-max-mob-' + gif);
    iconFavMaxMobile.setAttribute("src", "./assets/icon-fav-active.svg");

    agregarFavorito(gif);
}

//modal
let modalEscritorio = document.createElement("div");

function maxGifDesktop(img, id, slug, user, title){
    if (screen.width > 1200){
        modalEscritorio.style.display = "block";
        modalEscritorio.innerHTML = `
        <button class="modal-btn-close" onclick="cerrarModalEscritorioEncontrados()"><img src="./assets/button-close.svg" alt=""></button>
        <img src="${img}" alt="${id}" class="modal-gif">

        <div class="modal-bar">
            <div class="modal-textos">
                <p class="modal-user">${user}</p>
                <p class="modal-titulo">${title}</p>
            </div>
            <div>
                <button class="modal-btn" onclick="agregarFavoritoMax('${id}')"><img src="./assets/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-max-${id}"></button>
                <button class="modal-btn" onclick="descargarGifos('${img}', '${slug}')"><img src="./assets/icon-download.svg" alt="download-gif"></button>
            </div>
        </div>
    `;
    modalEscritorio.classList.add("modal-activado");
        document.body.appendChild(modalEscritorio);
    }
}

function cerrarModalEscritorioEncontrados() {
    modalEscritorio.style.display = "none";
    console.log("boton")
} 

//Favoritos
function agregarFavoritoBusqueda(gif){
    let iconFav = document.getElementById('icon-fav-' + gif);
    iconFav.setAttribute("src", "./assets/icon-fav-active.svg");

    agregarFavorito(gif);
}

function agregarFavorito(gif) {

    if (favoritosString == null) {
        favoritosArray = [];
    } else {
        favoritosArray = JSON.parse(favoritosString);
    }
    favoritosArray.push(gif);
    favoritosString = JSON.stringify(favoritosArray);
    localStorage.setItem("gifosFavoritos", favoritosString);
}

//Descargar gifos
async function descargarGifos(gifImg, gifNombre) {
    let blob = await fetch(gifImg).then(img => img.blob());;
    invokeSaveAsDialog(blob, gifNombre + ".gif");
}
