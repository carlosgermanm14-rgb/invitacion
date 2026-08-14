// ================== 1. BASE DE DATOS DE INVITADOS ==================
// ================== BASE DE DATOS DE INVITADOS ==================
const LISTA_INVITADOS = {
    "lora": { 
        familia: "Antonio Lora", 
        integrantes: [
            { nombre: "Antonio Lora", asiento: "Mesa 1 - Asiento A10" }
        ],
        ninos: 0,
        adultos: 1
    },
    "obed": { 
        familia: "Manuel Obed Inostroza Zepeda", 
        integrantes: [
            { nombre: "Obed Inostroza", asiento: "Mesa 1 - Asiento A10" },
            { nombre: "Invitado +1", asiento: "Mesa 1 - Asiento A09" }
        ],
        ninos: 0,
        adultos: 2
    },
    "paul": { 
        familia: "Familia German Meza", 
        integrantes: [
            { nombre: "Annel Meza", asiento: "Mesa 2 - Asiento B1" },
            { nombre: "Paul German", asiento: "Mesa 2 - Asiento B2" },
            { nombre: "Gael German Meza", asiento: "Mesa 2 - Asiento B3" }
        ],
        ninos: 1,
        adultos: 2
    },
    "padres-novio": { 
        familia: "Familia German Millan", 
        integrantes: [
            { nombre: "Rosa Millan", asiento: "Mesa Honor - Asiento H1" },
            { nombre: "Gregorio German", asiento: "Mesa Honor - Asiento H2" }
        ],
        ninos: 0,
        adultos: 2
    },
    "padres-novia": {
        familia: "Familia Lopez Ruiz",
        integrantes: [
            { nombre: "Luisa Ruiz", asiento: "Mesa Honor - Asiento H3" },
            { nombre: "Manuel Lopez", asiento: "Mesa Honor - Asiento H4" },
            { nombre: "Fernanda Lopez Ruiz", asiento: "Mesa Honor - Asiento H5" },
            { nombre: "Invitado +1", asiento: "Mesa Honor - Asiento H6" }
        ],
        ninos: 0,
        adultos: 4
    }
};


// ================== 2. LÓGICA DEL PASE Y URL ==================
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInvitado = urlParams.get('id');

    // PRIMERO verificamos que el invitado exista en la lista
    if (idInvitado && LISTA_INVITADOS[idInvitado]) {
        // Obtenemos sus datos
        const datos = LISTA_INVITADOS[idInvitado];
        
        // 1. Mostrar y llenar los datos en la tarjeta del PASE DE ACCESO
        const seccionPase = document.getElementById('seccion-pase');
        if (seccionPase) {
            seccionPase.style.display = 'block';
            
            // Asignar familia, adultos y niños
            if(document.getElementById('texto-familia')) document.getElementById('texto-familia').textContent = datos.familia;
            if(document.getElementById('texto-adultos')) document.getElementById('texto-adultos').textContent = datos.adultos;
            if(document.getElementById('texto-ninos')) document.getElementById('texto-ninos').textContent = datos.ninos;
            
            // Calcular el total de asientos (sumando adultos + niños)
            if(document.getElementById('texto-asientos')) {
                document.getElementById('texto-asientos').textContent = datos.adultos + datos.ninos;
            }
        }

        // =================NUEVO=================
        // MAGIA VIP PARA LOS PADRES
        if (idInvitado === "padres-novio" || idInvitado === "padres-novia" || idInvitado === "paul") {
            const tarjetaPase = document.getElementById('tarjeta-pase');
            const tituloPase = document.getElementById('titulo-pase');
            
            if (tarjetaPase) {
                tarjetaPase.classList.add('vip-gold-pass'); // Aplica el estilo dorado
            }
            if (tituloPase) {
                tituloPase.textContent = "PASE VIP DE HONOR"; // Cambia el texto
            }
        }
        // =======================================

        // 2. Mostrar nombre de la familia en la insignia del RSVP
        const familyDisplay = document.getElementById('rsvp-family-display');
        const familyNameText = document.getElementById('rsvp-family-name-text');
        
        if (familyDisplay && familyNameText) {
            familyDisplay.style.display = 'block';
            familyNameText.textContent = datos.familia;
        }

        // 3. Mostrar la lista de checkboxes
        const containerCheckboxes = document.getElementById('rsvp-checkboxes-container');
        const listDiv = document.getElementById('checkboxes-list');

        if (containerCheckboxes) containerCheckboxes.style.display = 'block';

        // Renderizar cada integrante como un checkbox mostrando su asiento
        if (listDiv) {
            listDiv.innerHTML = "";
            datos.integrantes.forEach((persona) => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                label.innerHTML = `
                    <input type="checkbox" name="asistentes_confirmados" value="${persona.nombre} (${persona.asiento})" checked>
                    <span><strong>${persona.nombre}</strong> <small style="opacity: 0.75; font-size: 0.75rem;">— ${persona.asiento}</small></span>
                `;
                listDiv.appendChild(label);
            });
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
        event.preventDefault(); // Evita recargar la página

        // 1. Obtener el nombre de la familia desde la tarjeta visual
        const familyNameElement = document.getElementById('rsvp-family-name-text');
        const nombreFamilia = (familyNameElement && familyNameElement.textContent !== "Familia") 
                              ? familyNameElement.textContent 
                              : "Invitado Web";

        const asistencia = document.getElementById('rsvp-asistencia').value;
        const mensaje = document.getElementById('rsvp-mensaje').value;

        // 2. Extraer las personas seleccionadas con sus asientos
        const checkboxes = document.querySelectorAll('input[name="asistentes_confirmados"]:checked');
        let personasConfirmadas = [];
        checkboxes.forEach(cb => personasConfirmadas.push(cb.value));

        // 3. Tu número de WhatsApp
        const telefono = "526671312162"; 

        // 4. Armar el mensaje estructurado
        let texto = `¡Hola! Quiero confirmar nuestra asistencia a su boda. 💍✨\n\n`;
        texto += `*Familia/Invitado:* ${nombreFamilia}\n`;
        texto += `*Asistencia:* ${asistencia}\n`;
        
        // Si confirman asistencia y seleccionaron al menos a un integrante
        if (asistencia === "Sí asistiremos" && personasConfirmadas.length > 0) {
            texto += `\n*Asistentes confirmados (${personasConfirmadas.length}):*\n`;
            personasConfirmadas.forEach(p => texto += ` • ${p}\n`);
        } else if (asistencia === "No asistiremos") {
            texto += `\nLamentablemente no podremos acompañarlos en esta ocasión.\n`;
        }
        
        if (mensaje) texto += `\n*Mensaje:* ${mensaje}\n`;

        // 5. Codificar para evitar errores con caracteres o saltos de línea
        const textoCodificado = encodeURIComponent(texto);
        whatsappUrl = `https://wa.me/${telefono}?text=${textoCodificado}`;

        // 6. Abrir ventana de confirmación
        if(rsvpModal) {
            rsvpModal.classList.add('show');
        }
    };
}

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        window.open(whatsappUrl, '_blank'); 
        if(rsvpModal) rsvpModal.classList.remove('show'); 
    });
}

// ================== 6. LÓGICA DEL CARRUSEL DE FOTOS ==================
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('carouselNav');
    
    if(track && nextButton && prevButton && dotsNav) {
        const slides = Array.from(track.children);
        const dots = Array.from(dotsNav.children);
        let currentIndex = 0;
        let carruselInterval;

        const moveToSlide = (index) => {
            // Mover la pista de imágenes
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Actualizar los puntitos de navegación
            dots.forEach(dot => dot.classList.remove('current-indicator'));
            dots[index].classList.add('current-indicator');
            
            currentIndex = index;
        };

        const avanzarCarrusel = () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0; // Si llega a la última, vuelve a la primera
            moveToSlide(nextIndex);
        };

        // Botón Siguiente
        nextButton.addEventListener('click', () => {
            avanzarCarrusel();
            resetIntervalo(); // Pausa el autoplay si el usuario interactúa
        });

        // Botón Anterior
        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1; 
            moveToSlide(prevIndex);
            resetIntervalo();
        });

        // Clic en los puntitos
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetIntervalo();
            });
        });

        // Autoplay (Pasa la foto sola cada 4 segundos)
        const iniciarIntervalo = () => {
            carruselInterval = setInterval(avanzarCarrusel, 4000);
        };

        const resetIntervalo = () => {
            clearInterval(carruselInterval);
            iniciarIntervalo();
        };

        // Iniciar el movimiento automático al cargar
        iniciarIntervalo();
    }
});

// ================== 7. LIGHTBOX (AMPLIAR FOTOS) ==================
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const images = document.querySelectorAll('.carousel-image'); // Selecciona todas las fotos del carrusel

    if (lightbox && lightboxImg && closeBtn) {
        
        // 1. Abrir la imagen al hacerle clic
        images.forEach(img => {
            img.addEventListener('click', function() {
                lightbox.style.display = 'flex';
                // Pequeño retraso para que la animación CSS funcione bien
                setTimeout(() => {
                    lightbox.classList.add('show');
                }, 10);
                lightboxImg.src = this.src; // Copia la ruta de la foto tocada
                document.body.style.overflow = 'hidden'; // Evita que la página de fondo se mueva
            });
        });

        // 2. Función para cerrar la imagen
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300); // Espera a que termine la animación para ocultarlo del todo
            document.body.style.overflow = 'auto'; // Restaura el scroll de la página
        };

        // Cerrar al tocar la "X"
        closeBtn.addEventListener('click', closeLightbox);

        // Cerrar al tocar cualquier parte oscura del fondo
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});