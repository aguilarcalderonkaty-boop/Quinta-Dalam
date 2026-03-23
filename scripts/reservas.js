/* Configuración del calendario */
const fp = flatpickr("#rango-fechas", {
    mode: "range",
    minDate: "today",
    dateFormat: "d/m/Y",
    locale: "es",
    showMonths: window.innerWidth > 768 ? 2 : 1,
    altInput: true,
    altFormat: "j F, Y",
    onReady: function (selectedDates, dateStr, instance) {
        instance.calendarContainer.classList.add('qd-calendar-theme');
    }
});

/* Ocupación */
let roomsData = [{ id: 1, adults: 2, children: 0 }];
let nextRoomId = 2;
const MAX_ROOMS = 4;
const MAX_ADULTS_PER_ROOM = 4;

const container = document.getElementById('rooms-container');
const trigger = document.getElementById('occupancy-trigger');
const dropdown = document.getElementById('occupancy-dropdown');
const btnAddRoom = document.getElementById('btn-add-room');
const btnConfirm = document.getElementById('btn-confirm-occ');

let ignoreNextDocClick = false;

trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    trigger.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (ignoreNextDocClick) {
        ignoreNextDocClick = false;
        return;
    }
    if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
        dropdown.classList.remove('active');
        trigger.classList.remove('active');
    }
});

dropdown.addEventListener('mousedown', () => {
    ignoreNextDocClick = true;
});

btnConfirm.addEventListener('click', () => {
    dropdown.classList.remove('active');
    trigger.classList.remove('active');
});

function renderRooms() {
    container.innerHTML = '';
    let totalAdults = 0, totalChildren = 0;

    roomsData.forEach((room, index) => {
        totalAdults += room.adults;
        totalChildren += room.children;

        const roomHtml = `
            <div class="room-block">
                <div class="room-header">
                    <span class="room-title">HABITACIÓN ${index + 1}</span>
                    ${roomsData.length > 1 ? `<button type="button" class="btn-delete-room" data-room-id="${room.id}" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button>` : ''}
                </div>
                <div class="occ-row">
                    <span class="occ-label-text">Adultos</span>
                    <div class="occ-controls">
                        <button type="button" class="btn-circle" data-room-id="${room.id}" data-type="adults" data-change="-1" ${room.adults <= 1 ? 'disabled' : ''}>-</button>
                        <span class="occ-count">${room.adults}</span>
                        <button type="button" class="btn-circle" data-room-id="${room.id}" data-type="adults" data-change="1" ${room.adults >= MAX_ADULTS_PER_ROOM ? 'disabled' : ''}>+</button>
                    </div>
                </div>
                <div class="occ-row" style="margin-top: 15px;">
                    <span class="occ-label-text">Niños</span>
                    <div class="occ-controls">
                        <button type="button" class="btn-circle" data-room-id="${room.id}" data-type="children" data-change="-1" ${room.children <= 0 ? 'disabled' : ''}>-</button>
                        <span class="occ-count">${room.children}</span>
                        <button type="button" class="btn-circle" data-room-id="${room.id}" data-type="children" data-change="1" ${room.children >= 3 ? 'disabled' : ''}>+</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', roomHtml);
    });

    document.getElementById('summary-guests').textContent = totalAdults + totalChildren;
    document.getElementById('summary-rooms').textContent = roomsData.length;
    document.getElementById('hidden-adults').value = totalAdults;
    document.getElementById('hidden-children').value = totalChildren;
    document.getElementById('hidden-rooms').value = roomsData.length;
    btnAddRoom.style.display = roomsData.length >= MAX_ROOMS ? 'none' : 'inline-block';
}

/* Delegación de eventos para botones de ocupación */
container.addEventListener('click', (e) => {
    e.stopPropagation();

    const circleBtn = e.target.closest('.btn-circle');
    if (circleBtn) {
        const roomId = parseInt(circleBtn.dataset.roomId);
        const type = circleBtn.dataset.type;
        const change = parseInt(circleBtn.dataset.change);
        const roomIndex = roomsData.findIndex(r => r.id === roomId);
        if (roomIndex > -1) {
            roomsData[roomIndex][type] += change;
            renderRooms();
        }
        return;
    }

    const deleteBtn = e.target.closest('.btn-delete-room');
    if (deleteBtn) {
        const roomId = parseInt(deleteBtn.dataset.roomId);
        roomsData = roomsData.filter(r => r.id !== roomId);
        renderRooms();
        return;
    }
});

btnAddRoom.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (roomsData.length < MAX_ROOMS) {
        roomsData.push({ id: nextRoomId++, adults: 2, children: 0 });
        renderRooms();
    }
});

/* Formulario de reserva con localStorage */
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const rangoFechas = document.getElementById('rango-fechas').value;
        if (!rangoFechas) {
            alert('Por favor selecciona las fechas de tu estancia.');
            return;
        }

        const fechas = rangoFechas.split(' a ');
        const fechaEntrada = fechas[0] || '';
        const fechaSalida = fechas[1] || fechas[0] || '';

        let noches = 1;
        if (fechas.length === 2) {
            const partsIn = fechaEntrada.split('/');
            const partsOut = fechaSalida.split('/');
            const dateIn = new Date(partsIn[2], partsIn[1] - 1, partsIn[0]);
            const dateOut = new Date(partsOut[2], partsOut[1] - 1, partsOut[0]);
            noches = Math.round((dateOut - dateIn) / 86400000);
            if (noches <= 0) noches = 1;
        }

        const bookingSearch = {
            fechaEntrada,
            fechaSalida,
            noches,
            adultos: parseInt(document.getElementById('hidden-adults').value),
            ninos: parseInt(document.getElementById('hidden-children').value),
            habitaciones: parseInt(document.getElementById('hidden-rooms').value),
            roomsDetail: roomsData,
            timestamp: Date.now()
        };

        localStorage.setItem('qd_booking_search', JSON.stringify(bookingSearch));
        window.location.href = 'reservacion.html';
    });
}

/* Botón "Más sobre nosotros" */
window.addEventListener('load', function () {
    const btnNosotros = document.getElementById('btn-mas-nosotros');
    const contentNosotros = document.getElementById('mas-nosotros-content');

    if (btnNosotros && contentNosotros) {
        btnNosotros.addEventListener('click', function (e) {
            e.preventDefault();
            if (contentNosotros.style.display === 'none' || contentNosotros.style.display === '') {
                contentNosotros.style.display = 'block';
                this.textContent = 'OCULTAR INFORMACIÓN';
                contentNosotros.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                contentNosotros.style.display = 'none';
                this.textContent = 'MÁS SOBRE NOSOTROS';
            }
        });
    }

    /* Formulario de contacto */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('contacto-nombre').value;
            const email = document.getElementById('contacto-email').value;
            const asuntoSelect = document.getElementById('contacto-asunto');
            const asunto = asuntoSelect.options[asuntoSelect.selectedIndex].text;
            const mensaje = document.getElementById('contacto-mensaje').value;

            const destinatario = 'contacto@quintadalam.com';
            const subject = encodeURIComponent(`[${asunto}] Mensaje de ${nombre}`);
            const body = encodeURIComponent(
                `Nombre: ${nombre}\nCorreo: ${email}\nAsunto: ${asunto}\n\nMensaje:\n${mensaje}`
            );

            window.location.href = `mailto:${destinatario}?subject=${subject}&body=${body}`;

            const contactMessages = JSON.parse(localStorage.getItem('qd_contact_messages') || '[]');
            contactMessages.push({ nombre, email, asunto, mensaje, fecha: new Date().toLocaleString('es-MX') });
            localStorage.setItem('qd_contact_messages', JSON.stringify(contactMessages));

            alert('¡Gracias por tu mensaje! Se abrirá tu cliente de correo para enviar el mensaje.');
            contactForm.reset();
        });
    }

    /* WhatsApp */
    const whatsappLink = document.querySelector('a[href*="wa.me"]');
    if (whatsappLink) {
        whatsappLink.addEventListener('click', function (e) {
            e.preventDefault();
            const defaultMsg = encodeURIComponent('¡Hola! Me interesa hacer una reservación en Hotel Quinta Dalam. ¿Podrían darme más información?');
            window.open(`https://wa.me/524431234567?text=${defaultMsg}`, '_blank');
        });
    }
});

renderRooms();