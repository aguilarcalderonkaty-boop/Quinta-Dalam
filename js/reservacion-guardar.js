function guardarReserva() {
    try {
        var session = JSON.parse(localStorage.getItem('qd_session') || 'null');
        if (!session) return;

        var roomIds = ['room101','room102','room103','room104','room105','room106',
                       'room201','room202','room203','room204','room205','room206','room207'];
        var roomNames = {
            'room101': '101 Tzintzuntzan', 'room102': '102 Paracho', 'room103': '103 Yunuen',
            'room104': '104 Pátzcuaro', 'room105': '105 Coeneo', 'room106': '106 Janitzio',
            'room201': '201 Suite Quencio', 'room202': '202 Morelia', 'room203': '203 Tacámbaro',
            'room204': '204 Uruapan', 'room205': '205 Tlalpujahua', 'room206': '206 Cuitzeo',
            'room207': '207 Cuanajo'
        };

        function parseMxn(s) {
            if (!s) return 0;
            var n = String(s).replace(/MXN\s*/i, '').replace(/,/g, '').replace(/\s/g, '').trim();
            return parseFloat(n) || 0;
        }
        function formatMxn(num) {
            return 'MXN ' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        var rooms = [];
        var totalNum = 0;
        for (var i = 0; i < roomIds.length; i++) {
            var rid = roomIds[i];
            var cb = document.getElementById(rid);
            if (!cb || !cb.checked) continue;
            var nm = roomNames[rid] || rid;
            var priceEl = document.querySelector('.' + rid + '-info .total-amount');
            var priceStr = priceEl ? priceEl.textContent.trim() : '—';
            totalNum += parseMxn(priceStr);
            rooms.push({ id: rid.replace('room', ''), name: nm, precio: priceStr });
        }

        if (rooms.length === 0) return;

        var roomNameSummary = rooms.map(function (r) { return r.name; }).join(', ');
        var precioTotal = rooms.length > 1 ? formatMxn(totalNum) : rooms[0].precio;

        var booking = JSON.parse(localStorage.getItem('qd_booking_search') || '{}');

        var reserva = {
            room: roomNameSummary,
            rooms: rooms,
            entrada: booking.fechaEntrada || '—',
            salida: booking.fechaSalida || '—',
            noches: booking.noches || 1,
            adultos: booking.adultos || 2,
            ninos: booking.ninos || 0,
            precio: precioTotal,
            fecha: new Date().toLocaleDateString('es-MX')
        };

        var users = JSON.parse(localStorage.getItem('qd_users') || '[]');
        var idx = users.findIndex(function(u) { return u.email === session.email; });
        if (idx > -1) {
            if (!users[idx].reservations) users[idx].reservations = [];
            users[idx].reservations.push(reserva);
            localStorage.setItem('qd_users', JSON.stringify(users));
        }
    } catch (e) {}
}
window.guardarReserva = guardarReserva;
