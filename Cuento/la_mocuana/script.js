let currentScene = 1;
const totalScenes = 4;
let voices = [];
const carouselIndices = { scene1: 0, scene2: 0, scene3: 0, scene4: 0 };
let carouselInterval = null; // Variable para el intervalo del carrusel

function showScene(sceneNumber) {
    document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
    const sceneElement = document.getElementById(`scene${sceneNumber}`);
    sceneElement.classList.add('active');
    updateCarousel(`scene${sceneNumber}`);
    stopCarousel(); // Detener el carrusel al cambiar de escena
}

function updateCarousel(sceneId) {
    const carousel = document.querySelector(`#${sceneId} .carousel-images`);
    const index = carouselIndices[sceneId];
    const imageWidth = 400;
    carousel.style.transform = `translateX(-${index * imageWidth}px)`;
}

function startCarousel(sceneId) {
    stopCarousel(); // Limpiar cualquier intervalo previo
    carouselInterval = setInterval(() => {
        const totalImages = 3;
        carouselIndices[sceneId] = (carouselIndices[sceneId] + 1) % totalImages; // Rotar cíclicamente
        updateCarousel(sceneId);
    }, 5000); // Cambia cada 5 segundos (ajusta este valor si quieres)
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function loadVoices() {
    voices = speechSynthesis.getVoices();
    console.log("Voces disponibles:");
    voices.forEach((voice, index) => console.log(`${index}: ${voice.name} (${voice.lang})`));
}

function narrateScene(text, sceneId) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "es-CO";
    const masculineVoice = voices.find(voice => 
        voice.lang.includes("es") && 
        (voice.name.includes("Pablo") || voice.name.includes("Juan") || 
         voice.name.includes("Jorge") || voice.name.includes("David") || 
         voice.name.includes("Carlos"))
    ) || voices.find(voice => voice.lang.includes("es"));

    if (masculineVoice) {
        speech.voice = masculineVoice;
        console.log("Voz seleccionada:", masculineVoice.name, masculineVoice.lang);
    } else {
        console.log("No se encontró una voz masculina en español.");
    }

    speech.rate = 1;
    speech.volume = 1;
    speech.pitch = 0.1;

    // Iniciar el carrusel cuando comienza la narración
    speech.onstart = () => {
        startCarousel(sceneId);
    };

    // Detener el carrusel cuando termina la narración
    speech.onend = () => {
        stopCarousel();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;
showScene(currentScene);

document.getElementById("nextButton").addEventListener("click", () => {
    if (currentScene < totalScenes) {
        currentScene++;
        showScene(currentScene);
    }
});

document.getElementById("prevButton").addEventListener("click", () => {
    if (currentScene > 1) {
        currentScene--;
        showScene(currentScene);
    }
});

document.querySelectorAll(".speakButton").forEach(button => {
    button.addEventListener("click", () => {
        const textId = button.getAttribute("data-text");
        const textContent = document.getElementById(textId).textContent;
        const sceneId = button.closest('.scene').id; // Obtener el ID de la escena actual
        narrateScene(textContent, sceneId);
    });
});

document.querySelectorAll(".scene").forEach(scene => {
    const sceneId = scene.id;
    const prevButton = scene.querySelector(".carousel-prev");
    const nextButton = scene.querySelector(".carousel-next");
    const totalImages = 3;

    prevButton.addEventListener("click", () => {
        if (carouselIndices[sceneId] > 0) {
            carouselIndices[sceneId]--;
            updateCarousel(sceneId);
        }
    });

    nextButton.addEventListener("click", () => {
        if (carouselIndices[sceneId] < totalImages - 1) {
            carouselIndices[sceneId]++;
            updateCarousel(sceneId);
        }
    });
});