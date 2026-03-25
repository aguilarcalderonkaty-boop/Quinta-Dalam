(function() {
    var session = JSON.parse(localStorage.getItem('qd_session') || 'null');
    if (!session) return;

    var fillOnce = false;
    document.addEventListener('change', function(e) {
        if (e.target.id === 'toggle-datos-personales' && e.target.checked && !fillOnce) {
            fillOnce = true;
            setTimeout(function() {
                fillFromSession();
            }, 100);
        }
    });

    function fillFromSession() {
        var nombre = document.getElementById('nombre');
        var apPaterno = document.getElementById('ap-paterno');
        var apMaterno = document.getElementById('ap-materno');
        var fechaNac = document.getElementById('fecha_nacimiento');
        var telefono = document.getElementById('telefono');
        var email = document.getElementById('email');
        var direccion = document.getElementById('direccion');
        if (nombre && session.name) nombre.value = session.name;
        if (apPaterno && session.apPaterno) apPaterno.value = session.apPaterno;
        if (apMaterno && session.apMaterno) apMaterno.value = session.apMaterno;
        if (fechaNac && session.dob) fechaNac.value = session.dob;
        if (telefono && session.phone) telefono.value = session.phone;
        if (email && session.email) email.value = session.email;
        if (direccion && session.direccion) direccion.value = session.direccion;
    }

    setTimeout(function() {
        var t = document.getElementById('toggle-datos-personales');
        if (t && t.checked) fillFromSession();
    }, 400);
})();
