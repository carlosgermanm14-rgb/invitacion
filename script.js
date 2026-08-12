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

// ================== ENVIAR RSVP A WHATSAPP ==================
// ================== ENVIAR RSVP A WHATSAPP Y MODAL ==================
const rsvpForm = document.getElementById('rsvp-form');
const rsvpModal = document.getElementById('rsvp-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
let whatsappUrl = ""; // Variable para guardar el link

if(rsvpForm) {
    rsvpForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const nombre = document.getElementById('rsvp-nombre').value;
        const asistencia = document.getElementById('rsvp-asistencia').value;
        const personas = document.getElementById('rsvp-personas').value;
        const mensaje = document.getElementById('rsvp-mensaje').value;

        // TU NÚMERO
        const telefono = "526671312162"; // <-- ¡CAMBIA ESTO!

        let texto = `¡Hola! Quiero confirmar mi asistencia a su boda. 💍✨%0A%0A`;
        texto += `*Nombre:* ${nombre}%0A`;
        texto += `*Asistencia:* ${asistencia}%0A`;
        if (personas) texto += `*No. de personas:* ${personas}%0A`;
        if (mensaje) texto += `*Mensaje:* ${mensaje}%0A`;

        whatsappUrl = `https://wa.me/${telefono}?text=${texto}`;

        // Mostrar el modal elegante en lugar del alert feo
        rsvpModal.classList.add('show');
    });
}

// Cuando hagan clic en "CONTINUAR" en el cuadro bonito, se abre WhatsApp y se cierra el cuadro
if(closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        window.open(whatsappUrl, '_blank');
        rsvpModal.classList.remove('show');
        rsvpForm.reset(); // Limpia el formulario
    });
}