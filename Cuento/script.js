// Función para el narrador
function saludar() {
    document.getElementById("mensaje-bienvenida").textContent = "¡Hola! Bienvenido a nuestro mundo de mitos y leyendas.";
    document.getElementById("audio-bienvenida").play();
}

// Función para redireccionar a los cuentos
function irACuento(url) {
    window.location.href = url;
}

// Carrusel automático y con botones
let carrusel = document.getElementById("carrusel");
let intervalo = setInterval(() => {
    carrusel.scrollBy({ left: 150, behavior: "smooth" });
}, 3000);

// Botones de navegación manual
document.getElementById("prevBtn").addEventListener("click", () => {
    carrusel.scrollBy({ left: -150, behavior: "smooth" });
});

document.getElementById("nextBtn").addEventListener("click", () => {
    carrusel.scrollBy({ left: 150, behavior: "smooth" });
});
