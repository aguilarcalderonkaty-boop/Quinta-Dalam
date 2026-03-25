(function () {
    let data = JSON.parse(localStorage.getItem('qd_booking_search') || 'null');
    let editRooms = [{ adults: 2, children: 0 }];
    const MAX_EDIT_ROOMS = 4;

    function buildPersonsText(adultos, ninos) {
        let txt = adultos + ' adulto' + (adultos !== 1 ? 's' : '');
        if (ninos > 0) txt += ', ' + ninos + ' niño' + (ninos !== 1 ? 's' : '');
        return txt;
    }

    function updateSummaryDisplay(d) {
        const elEntrada = document.getElementById('sum-entrada');
        const elSalida = document.getElementById('sum-salida');
        const elHab = document.getElementById('sum-habitaciones');
        const elPers = document.getElementById('sum-personas');

        if (elEntrada) elEntrada.innerHTML = '<i class="fa-regular fa-calendar" style="color:#3A1F23;margin-right:5px;"></i> ' + d.fechaEntrada;
        if (elSalida) elSalida.textContent = d.fechaSalida;
        if (elHab) elHab.textContent = d.habitaciones;
        if (elPers) elPers.textContent = buildPersonsText(d.adultos, d.ninos);

        const cartDetails = document.querySelector('.cart-details');
        if (cartDetails) {
            const paragraphs = cartDetails.querySelectorAll('p');
            if (paragraphs[0]) paragraphs[0].textContent = d.fechaEntrada + ' - ' + d.fechaSalida + ' (' + d.noches + ' noche' + (d.noches !== 1 ? 's' : '') + ')';
            if (paragraphs[1]) paragraphs[1].textContent = buildPersonsText(d.adultos, d.ninos);
        }
    }

    if (data) updateSummaryDisplay(data);

    function renderEditRooms() {
        const container = document.getElementById('edit-rooms-container');
        if (!container) return;
        container.innerHTML = '';
        editRooms.forEach((room, idx) => {
            const html = `
                    <div class="edit-room-block">
                        <div class="edit-room-header">
                            <span class="edit-room-title">Habitación ${idx + 1}</span>
                            ${editRooms.length > 1 ? '<button type="button" class="edit-room-delete" data-idx="' + idx + '"><i class="fa-regular fa-trash-can"></i></button>' : ''}
                        </div>
                        <div class="edit-occ-row">
                            <span class="edit-occ-label">Adultos</span>
                            <div class="edit-occ-controls">
                                <button type="button" class="edit-btn-circle" data-idx="${idx}" data-type="adults" data-change="-1" ${room.adults <= 1 ? 'disabled' : ''}>−</button>
                                <span class="edit-occ-count">${room.adults}</span>
                                <button type="button" class="edit-btn-circle" data-idx="${idx}" data-type="adults" data-change="1" ${room.adults >= 4 ? 'disabled' : ''}>+</button>
                            </div>
                        </div>
                        <div class="edit-occ-row">
                            <span class="edit-occ-label">Niños</span>
                            <div class="edit-occ-controls">
                                <button type="button" class="edit-btn-circle" data-idx="${idx}" data-type="children" data-change="-1" ${room.children <= 0 ? 'disabled' : ''}>−</button>
                                <span class="edit-occ-count">${room.children}</span>
                                <button type="button" class="edit-btn-circle" data-idx="${idx}" data-type="children" data-change="1" ${room.children >= 3 ? 'disabled' : ''}>+</button>
                            </div>
                        </div>
                    </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });
        const addBtn = document.getElementById('edit-add-room');
        if (addBtn) addBtn.style.display = editRooms.length >= MAX_EDIT_ROOMS ? 'none' : 'inline-block';
    }

    document.addEventListener('click', function (e) {
        const circleBtn = e.target.closest('.edit-btn-circle');
        if (circleBtn) {
            e.stopPropagation();
            const idx = parseInt(circleBtn.dataset.idx);
            const type = circleBtn.dataset.type;
            const change = parseInt(circleBtn.dataset.change);
            if (editRooms[idx]) {
                editRooms[idx][type] += change;
                renderEditRooms();
            }
            return;
        }
        const delBtn = e.target.closest('.edit-room-delete');
        if (delBtn) {
            e.stopPropagation();
            const idx = parseInt(delBtn.dataset.idx);
            editRooms.splice(idx, 1);
            renderEditRooms();
            return;
        }
    });

    const editAddRoom = document.getElementById('edit-add-room');
    if (editAddRoom) {
        editAddRoom.addEventListener('click', function (e) {
            e.preventDefault();
            if (editRooms.length < MAX_EDIT_ROOMS) {
                editRooms.push({ adults: 2, children: 0 });
                renderEditRooms();
            }
        });
    }

    let fpRange;
    function initFlatpickr() {
        fpRange = flatpickr('#edit-rango-fechas', {
            mode: 'range',
            dateFormat: 'd/m/Y',
            locale: 'es',
            minDate: 'today',
            showMonths: window.innerWidth > 768 ? 2 : 1,
            onReady: function (s, d, instance) { instance.calendarContainer.classList.add('qd-edit-calendar'); }
        });
    }

    const btnEdit = document.getElementById('btn-edit-summary');
    const panel = document.getElementById('summary-edit-panel');
    const btnSave = document.getElementById('btn-save-edit');
    const btnCancel = document.getElementById('btn-cancel-edit');
    let fpInitialized = false;

    if (btnEdit && panel) {
        btnEdit.addEventListener('click', function () {
            const isOpen = panel.style.display !== 'none';
            if (isOpen) { panel.style.display = 'none'; return; }

            if (!fpInitialized) { initFlatpickr(); fpInitialized = true; }

            const d = data || { fechaEntrada: '', fechaSalida: '', adultos: 2, ninos: 0, habitaciones: 1 };
            if (fpRange && d.fechaEntrada && d.fechaSalida) {
                fpRange.setDate([
                    flatpickr.parseDate(d.fechaEntrada, 'd/m/Y'),
                    flatpickr.parseDate(d.fechaSalida, 'd/m/Y')
                ]);
            }

            if (d.roomsDetail && d.roomsDetail.length > 0) {
                editRooms = d.roomsDetail.map(r => ({ adults: r.adults, children: r.children }));
            } else {
                editRooms = [];
                for (let i = 0; i < d.habitaciones; i++) {
                    editRooms.push({ adults: Math.ceil(d.adultos / d.habitaciones), children: Math.floor(d.ninos / d.habitaciones) });
                }
                if (editRooms.length === 0) editRooms.push({ adults: 2, children: 0 });
            }
            renderEditRooms();
            panel.style.display = 'block';
        });

        btnCancel.addEventListener('click', function () { panel.style.display = 'none'; });

        btnSave.addEventListener('click', function () {
            const rangoVal = document.getElementById('edit-rango-fechas').value.trim();
            if (!rangoVal) { alert('Por favor selecciona las fechas.'); return; }

            const partes = rangoVal.split(' a ');
            const entrada = partes[0] || '';
            const salida = partes[1] || partes[0] || '';

            let totalAdultos = 0, totalNinos = 0;
            editRooms.forEach(r => { totalAdultos += r.adults; totalNinos += r.children; });

            let noches = 1;
            const pe = entrada.split('/'), ps = salida.split('/');
            if (pe.length === 3 && ps.length === 3) {
                const dIn = new Date(pe[2], pe[1] - 1, pe[0]);
                const dOut = new Date(ps[2], ps[1] - 1, ps[0]);
                noches = Math.round((dOut - dIn) / 86400000);
                if (noches <= 0) noches = 1;
            }

            data = {
                fechaEntrada: entrada,
                fechaSalida: salida,
                noches: noches,
                adultos: totalAdultos,
                ninos: totalNinos,
                habitaciones: editRooms.length,
                roomsDetail: editRooms,
                timestamp: Date.now()
            };

            localStorage.setItem('qd_booking_search', JSON.stringify(data));
            updateSummaryDisplay(data);
            panel.style.display = 'none';
        });
    }
})();
