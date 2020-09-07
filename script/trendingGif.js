//Variable
apiKey = "RUpoxf7EHQzQ8ZBbGKJWDXMoQabiTrQq";


let sliderTrendingGifos = document.getElementById('trending-slider');
trendingGifos();
//traer gifos al slider
function trendingGifos() {
    let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=8`;

    fetch(url)
        .then(resp => resp.json()) 
        .then(content => {
            let trendingGifArray = content.data;
            let trendingGIFOhtml = "";
            //Pintar los gifos encontrados
            for (let i = 0; i < trendingGifArray.length; i++) {
                let trendingGif = trendingGifArray[i];
                trendingGIFOhtml += `
            <div class="gif-contenedor" onclick="maxGifMobileTrending('${trendingGif.images.downsized.url}', '${trendingGif.id}', '${trendingGif.slug}', '${trendingGif.username}', '${trendingGif.title}')">
                    <div class="gif-acciones">
                        <div class="iconos-acciones-gif">
                            <button class="iconos-acciones-box favorito" onclick="agregarFavoritoTrending('${trendingGif.id}')">
                                <img src="./assets/icon-fav-hover.svg" alt="icon-favorito" id="icon-fav-trending-${trendingGif.id}">
                            </button>
                            <button class="iconos-acciones-box download" onclick="descargarGifTrending('${trendingGif.images.downsized.url}', '${trendingGif.slug}')">
                                <img src="./assets/icon-download.svg" alt="icon-download">
                            </button>
                            <button class="iconos-acciones-box max" onclick="maxGifDesktopTrending('${trendingGif.images.downsized.url}', '${trendingGif.id}', '${trendingGif.slug}', '${trendingGif.username}', '${trendingGif.title}')">
                                <img src="./assets/icon-max.svg" alt="icon-max">
                            </button>
                        </div>
                        <div class="textos-descripcion-gif">
                            <p class="user-gif">${trendingGif.username}</p>
                            <p class="titulo-gif">${trendingGif.title}</p>
                        </div>
                    </div>
                    <img src="${trendingGif.images.downsized.url}" alt="${trendingGif.title}" class="trending-gif">
                </div>
            `
            }
            sliderTrendingGifos.innerHTML = trendingGIFOhtml;
        })
        .catch(err => {
            console.log(err);
        })
}

let imageIndex = 1;
let translateX = 0;
let trendingBtnPrev = document.getElementById('trending-btn-previous');
let trendingBtnNext = document.getElementById('trending-btn-next');

//boton siguiente
trendingBtnNext.addEventListener('click', sliderNext);
function sliderNext() {
    if (window.matchMedia("(min-width: 1200px)").matches) {
        if (imageIndex <= 5) {
            imageIndex++;
            translateX -= 390;
            sliderTrendingGifos.style.transform = `translateX(${translateX}px)`;
        }
    } else if (window.matchMedia("(min-width: 376px)").matches) {
        if (imageIndex <= 5) {
            imageIndex++;
            translateX -= 270;
            sliderTrendingGifos.style.transform = `translateX(${translateX}px)`;
        }
    }
}
//Boton regresar
trendingBtnPrev.addEventListener('click', sliderPrev);
function sliderPrev() {
    if (window.matchMedia("(min-width: 1200px)").matches) {
        if (imageIndex !== 1) {
            imageIndex--;
            translateX += 390;
            sliderTrendingGifos.style.transform = `translateX(${translateX}px)`;
        }
    } else if (window.matchMedia("(min-width: 376px)").matches) {
        if (imageIndex !== 1) {
            imageIndex--;
            translateX += 270;
            sliderTrendingGifos.style.transform = `translateX(${translateX}px)`;
        }
    }
}
//Vista modal gif
modalMobile = document.createElement("div");
modalDesktop = document.createElement("div");

function maxGifMobileTrending(img, id, slug, user, title) {
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
            <button class="modal-btn" onclick="agregarFavoritoMaxMobileTrending('${id}')"><img src="./assets/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-max-mob-trending-${id}"></button>
            <button class="modal-btn" onclick="descargarGifTrending('${img}', '${slug}')"><img src="./assets/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>
    `;
        modalMobile.classList.add("modal-activado");
        document.body.appendChild(modalMobile);
    }
}

//Cerrar modal
function cerrarModalMobile() {
    modalMobile.style.display = "none";
}

//Favorito
function agregarFavoritoMaxMobileTrending(gif) {

    let iconFavMaxMobile = document.getElementById('icon-fav-max-mob-trending-' + gif);
    iconFavMaxMobile.setAttribute("src", "./assets/icon-fav-active.svg");
    agregarFavoritoTrendingGral(gif);
}
function maxGifDesktopTrending(img, id, slug, user, title) {
    if (screen.width > 1200) {
        modalDesktop.style.display = "block";
        modalDesktop.innerHTML = `
    <button class="modal-btn-close" onclick="cerrarModalEscritorio()"><img src="./assets/button-close.svg" alt=""></button>
    <img src="${img}" alt="${id}" class="modal-gif">

    <div class="modal-bar">
        <div class="modal-textos">
            <p class="modal-user">${user}</p>
            <p class="modal-titulo">${title}</p>
        </div>
        <div>
            <button class="modal-btn" onclick="agregarFavoritoMax('${id}')"><img src="./assets/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-max-${id}"></button>
            <button class="modal-btn" onclick="descargarGif('${img}', '${slug}')"><img src="./assets/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>
    `;
        modalDesktop.classList.add("modal-activado");
        document.body.appendChild(modalDesktop);
    }
}

function cerrarModalEscritorio() {
    modalDesktop.style.display = "none";
}

function agregarFavoritoMax(gif) {
    let iconFavMax = document.getElementById('icon-fav-max-' + gif);
    iconFavMax.setAttribute("src", "./assets/icon-fav-active.svg");
    agregarFavoritoTrendingGral(gif);
}

//Agregar a favoritos
favoritosArray = [];
favoritosString = localStorage.getItem("gifosFavoritos");

function agregarFavoritoTrending(gif) {
    let iconFav = document.getElementById('icon-fav-trending-' + gif);
    iconFav.setAttribute("src", "./assets/icon-fav-active.svg");
    agregarFavoritoTrendingGral(gif);

}

function agregarFavoritoTrendingGral(gif) {
    if (favoritosString == null) {
        favoritosArray = [];
    } else {
        favoritosArray = JSON.parse(favoritosString);
    }
    //Cargar al local store
    favoritosArray.push(gif);
    favoritosString = JSON.stringify(favoritosArray);
    localStorage.setItem("gifosFavoritos", favoritosString);
   
}

//Descargar gifos
async function descargarGifTrending(gifImg, gifNombre) {
    let blob = await fetch(gifImg).then(img => img.blob());
    invokeSaveAsDialog(blob, gifNombre + ".gif");
}

