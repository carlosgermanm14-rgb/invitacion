// ================== 1. BASE DE DATOS DE INVITADOS ==================
const LISTA_INVITADOS = {
    "perez": { 
        familia: "Familia Pérez López", 
        integrantes: ["Juan Pérez", "María López", "Sofía Pérez"] 
    },
    "tios-lopez": { 
        familia: "Tíos López", 
        integrantes: ["Carlos López", "Ana Martínez"] 
    },
    "juan-carlos": { 
        familia: "Juan Carlos Martínez", 
        integrantes: ["Juan Carlos Martínez"] 
    }
};


// ================== 2. LÓGICA DEL PASE Y URL ==================
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInvitado = urlParams.get('id');

    if (idInvitado && LISTA_INVITADOS[idInvitado]) {
        const datos = LISTA_INVITADOS[idInvitado];
        
        // Mostrar nombre de la familia en la tarjeta elegante
        const familyDisplay = document.getElementById('rsvp-family-display');
        const familyNameText = document.getElementById('rsvp-family-name-text');
        
        if (familyDisplay && familyNameText) {
            familyDisplay.style.display = 'block';
            familyNameText.textContent = datos.familia;
        }

        // Mostrar la lista de checkboxes
        const containerCheckboxes = document.getElementById('rsvp-checkboxes-container');
        const listDiv = document.getElementById('checkboxes-list');

        if (containerCheckboxes) containerCheckboxes.style.display = 'block';

        // Renderizar cada nombre como un checkbox
        if (listDiv) {
            listDiv.innerHTML = "";
            datos.integrantes.forEach((nombre) => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                label.innerHTML = `
                    <input type="checkbox" name="asistentes_confirmados" value="${nombre}" checked>
                    <span>${nombre}</span>
                `;
                listDiv.appendChild(label);
            });
        }

        // Mostrar la tarjeta del pase superior si existe
        const seccionPase = document.getElementById('seccion-pase');
        if (seccionPase) {
            seccionPase.style.display = 'block';
            if(document.getElementById('texto-familia')) document.getElementById('texto-familia').textContent = datos.familia;
            if(document.getElementById('texto-asientos')) document.getElementById('texto-asientos').textContent = datos.integrantes.length;
        }
    }
});

// ================== 3. LÓGICA DEL SOBRE Y MÚSICA ==================
const envelope = document.getElementById('envelope-wrapper');
const body = document.body;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

if (envelope) {
    body.style.overflow = 'hidden'; // Bloquear scroll inicial
    envelope.addEventListener('click', function() {
        envelope.classList.add('open');

        if (bgMusic) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if(musicBtn) musicBtn.classList.add('visible');
            }).catch(error => console.log("Autoplay bloqueado", error));
        }

        setTimeout(() => {
            body.style.overflow = 'auto'; 
            envelope.style.display = 'none'; 
        }, 1500); 
    });
}

if (musicBtn && bgMusic) {
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
}

// ================== 4. CUENTA REGRESIVA ==================
const fechaBoda = new Date("Jan 23, 2027 13:00:00").getTime();
const timer = setInterval(function() {
    const ahora = new Date().getTime();
    const distancia = fechaBoda - ahora;

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    if (document.getElementById("days")) {
        document.getElementById("days").innerHTML = dias < 10 ? '0' + dias : dias;
        document.getElementById("hours").innerHTML = horas < 10 ? '0' + horas : horas;
        document.getElementById("minutes").innerHTML = minutos < 10 ? '0' + minutos : minutos;
        document.getElementById("seconds").innerHTML = segundos < 10 ? '0' + segundos : segundos;
    }

    if (distancia < 0) {
        clearInterval(timer);
        if (document.getElementById("countdown")) {
            document.getElementById("countdown").innerHTML = "<h3 style='font-family: var(--fuente-nombres); color: var(--azul-tinta); font-size: 2rem; letter-spacing: 4px;'>¡ES HOY!</h3>";
        }
    }
}, 1000);

// ================== 5. ENVÍO A WHATSAPP Y MODAL ==================
const rsvpForm = document.getElementById('rsvp-form');
const rsvpModal = document.getElementById('rsvp-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
let whatsappUrl = ""; 

if(rsvpForm) {
    rsvpForm.onsubmit = function(event) {
        event.preventDefault(); // Bloquea la recarga de página

        // Obtener el nombre de la familia desde el texto bonito (si existe) o usar un genérico
        const familyNameElement = document.getElementById('rsvp-family-name-text');
        const nombreFamilia = (familyNameElement && familyNameElement.textContent !== "Familia") 
                              ? familyNameElement.textContent 
                              : "Invitado Web";

        const asistencia = document.getElementById('rsvp-asistencia').value;
        const mensaje = document.getElementById('rsvp-mensaje').value;

        // Extraer los asistentes que sí marcaron la casilla
        const checkboxes = document.querySelectorAll('input[name="asistentes_confirmados"]:checked');
        let personasConfirmadas = [];
        checkboxes.forEach(cb => personasConfirmadas.push(cb.value));

        // TU NÚMERO
        const telefono = "526671312162"; 

        // Armar el texto para WhatsApp
        let texto = `¡Hola! Quiero confirmar nuestra asistencia a su boda. 💍✨\n\n`;
        texto += `*Familia/Invitado:* ${nombreFamilia}\n`;
        // Si asisten y hay personas seleccionadas, hacer la lista en WhatsApp
        if (personasConfirmadas.length > 0) {
            texto += `*Asistentes confirmados (${personasConfirmadas.length}):*\n`;
            personasConfirmadas.forEach(p => texto += ` • ${p}\n`);
        }
        
        if (mensaje) texto += `*Mensaje:* ${mensaje}\n`;

        // Codificar el texto para que la URL no se rompa
        const textoCodificado = encodeURIComponent(texto);
        whatsappUrl = `https://wa.me/${telefono}?text=${textoCodificado}`;

        if(rsvpModal) {
            rsvpModal.classList.add('show');
        }
    };
}

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        window.open(whatsappUrl, '_blank'); 
        rsvpModal.classList.remove('show'); 
    });
}