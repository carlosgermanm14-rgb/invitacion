// --- LÓGICA DEL SOBRE ---
const envelope = document.getElementById('envelope-wrapper');
const body = document.body;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

// Bloquear scroll inicial
body.style.overflow = 'hidden';

envelope.addEventListener('click', function() {
    envelope.classList.add('open');

    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('visible'); // Mostrar el botón
    }).catch(error => {
        console.log("El navegador bloqueó el autoplay", error);
    });
    setTimeout(() => {
        body.style.overflow = 'auto'; // Permitir scroll
        envelope.style.display = 'none'; 
    }, 1500); 
});

// --- LÓGICA DE LA CUENTA REGRESIVA ---
// Fecha de la boda: Enero 23, 2027 a la 1:00 PM (13:00)
const fechaBoda = new Date("Jan 23, 2027 13:00:00").getTime();

// Control para pausar/reproducir la música
musicBtn.addEventListener('click', function() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.add('muted');
        isPlaying = false;
    } else {
        bgMusic.play();
        musicBtn.classList.remove('muted');
        isPlaying = true;
    }
});

const timer = setInterval(function() {
    const ahora = new Date().getTime();
    const distancia = fechaBoda - ahora;

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = dias < 10 ? '0' + dias : dias;
    document.getElementById("hours").innerHTML = horas < 10 ? '0' + horas : horas;
    document.getElementById("minutes").innerHTML = minutos < 10 ? '0' + minutos : minutos;
    document.getElementById("seconds").innerHTML = segundos < 10 ? '0' + segundos : segundos;

    if (distancia < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "<h3 style='font-family: var(--fuente-nombres); color: var(--azul-tinta); font-size: 2rem; letter-spacing: 4px;'>¡ES HOY!</h3>";
    }
}, 1000);

// --- FORMULARIO RSVP ---
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('¡Gracias! Tu confirmación ha sido registrada.');
    this.reset();
});