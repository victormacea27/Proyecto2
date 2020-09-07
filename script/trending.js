let tendenciasTexto = document.getElementById("tendencia");
let apiKey = "RUpoxf7EHQzQ8ZBbGKJWDXMoQabiTrQq";
document.addEventListener("DOMContentLoaded", tendenciasActuales);

function tendenciasActuales(){
let gifos = fetch('https://api.giphy.com/v1/trending/searches?api_key=RUpoxf7EHQzQ8ZBbGKJWDXMoQabiTrQq')
.then(response => response.json() )
.then(content => {

    tendenciasTexto.innerHTML =`
    <h2>Trending:</h2>
    <h4>${content.data[0]}, ${content.data[1]}, ${content.data[2]}, ${content.data[3]}, ${content.data[4]}</h4>
    
    `;
})
.catch(err => {
console.log(err);
});
}