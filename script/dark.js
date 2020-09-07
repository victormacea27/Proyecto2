function cambiarModo() { 
    var colorbody = document.body; 
    //clase del css para modo nocturno "Dark"
    colorbody.classList.toggle("dark");
}
let modo = document.getElementById("modo");
modo.addEventListener("click", cambiarModo);

