(function () {
  var overlay = document.getElementById('auth-overlay');
  var btnOpen = document.getElementById('btn-open-login');
  var btnClose = document.getElementById('auth-close');
  var btnUserMenu = document.getElementById('btn-user-menu');
  var welcomeName = document.getElementById('welcome-name');
  var panelLogin = document.getElementById('panel-login');
  var panelRegister = document.getElementById('panel-register');
  var formLogin = document.getElementById('form-login');
  var formRegister = document.getElementById('form-register');
  var loginError = document.getElementById('login-error');
  var regError = document.getElementById('reg-error');

  var sidebarOverlay = document.getElementById('user-sidebar-overlay');
  var sidebar = document.getElementById('user-sidebar');
  var sidebarClose = document.getElementById('sidebar-close');
  var sidebarName = document.getElementById('sidebar-user-name');
  var sidebarEmail = document.getElementById('sidebar-user-email');
  var sidebarReservas = document.getElementById('sidebar-reservas');
  var sidebarPerfil = document.getElementById('sidebar-perfil');
  var sidebarLogout = document.getElementById('sidebar-logout');
  var reservasPanel = document.getElementById('sidebar-reservas-panel');
  var perfilPanel = document.getElementById('sidebar-perfil-panel');
  var formEditProfile = document.getElementById('form-edit-profile');

  if (!overlay || !btnOpen) return;

  function getUsers() {
    return JSON.parse(localStorage.getItem('qd_users') || '[]');
  }
  function saveUsers(users) {
    localStorage.setItem('qd_users', JSON.stringify(users));
  }
  function getSession() {
    return JSON.parse(localStorage.getItem('qd_session') || 'null');
  }
  function saveSession(user) {
    localStorage.setItem('qd_session', JSON.stringify(user));
  }
  function clearSession() {
    localStorage.removeItem('qd_session');
  }

  function updateUI() {
    var session = getSession();
    if (session) {
      btnOpen.style.display = 'none';
      btnUserMenu.style.display = 'flex';
      welcomeName.textContent = '¡Bienvenido, ' + session.name.split(' ')[0] + '!';
    } else {
      btnOpen.style.display = 'flex';
      btnUserMenu.style.display = 'none';
    }
  }

  btnOpen.addEventListener('click', function (e) {
    e.preventDefault();
    overlay.classList.add('active');
    panelLogin.style.display = 'block';
    panelRegister.style.display = 'none';
    loginError.style.display = 'none';
  });

  btnClose.addEventListener('click', function () {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  document.getElementById('show-register').addEventListener('click', function (e) {
    e.preventDefault();
    panelLogin.style.display = 'none';
    panelRegister.style.display = 'block';
    regError.style.display = 'none';
  });
  document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    panelRegister.style.display = 'none';
    panelLogin.style.display = 'block';
    loginError.style.display = 'none';
  });

  formRegister.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = document.getElementById('reg-nombre').value.trim();
    var apPaterno = document.getElementById('reg-ap-paterno').value.trim();
    var apMaterno = document.getElementById('reg-ap-materno').value.trim();
    var dob = document.getElementById('reg-dob').value;
    var email = document.getElementById('reg-email').value.trim().toLowerCase();
    var phone = document.getElementById('reg-phone').value.trim();
    var pass = document.getElementById('reg-pass').value;

    var hoy = new Date();
    var nacimiento = new Date(dob);
    var edad = hoy.getFullYear() - nacimiento.getFullYear();
    var m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    if (edad < 18) {
      regError.textContent = 'Debes ser mayor de 18 años para registrarte.';
      regError.style.display = 'block';
      return;
    }

    var users = getUsers();
    if (users.find(function (u) { return u.email === email; })) {
      regError.textContent = 'Ya existe una cuenta con ese correo.';
      regError.style.display = 'block';
      return;
    }

    var newUser = {
      name: nombre,
      apPaterno: apPaterno,
      apMaterno: apMaterno,
      dob: dob,
      email: email,
      phone: phone,
      password: pass,
      direccion: '',
      reservations: [],
    };
    users.push(newUser);
    saveUsers(users);
    saveSession(newUser);
    overlay.classList.remove('active');
    formRegister.reset();
    updateUI();
  });

  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value.trim().toLowerCase();
    var pass = document.getElementById('login-pass').value;

    var users = getUsers();
    var user = users.find(function (u) {
      return u.email === email && u.password === pass;
    });
    if (!user) {
      loginError.textContent = 'Correo o contraseña incorrectos.';
      loginError.style.display = 'block';
      return;
    }

    saveSession(user);
    overlay.classList.remove('active');
    formLogin.reset();
    updateUI();
  });

  btnUserMenu.addEventListener('click', function (e) {
    e.preventDefault();
    var session = getSession();
    if (session) {
      sidebarName.textContent = session.name + ' ' + (session.apPaterno || '');
      sidebarEmail.textContent = session.email;
      reservasPanel.style.display = 'none';
      perfilPanel.style.display = 'none';
      sidebarOverlay.classList.add('active');
    }
  });

  sidebarClose.addEventListener('click', function () {
    sidebarOverlay.classList.remove('active');
  });

  sidebarOverlay.addEventListener('click', function (e) {
    if (e.target === sidebarOverlay) sidebarOverlay.classList.remove('active');
  });

  sidebarLogout.addEventListener('click', function (e) {
    e.preventDefault();
    clearSession();
    sidebarOverlay.classList.remove('active');
    updateUI();
  });

  sidebarReservas.addEventListener('click', function (e) {
    e.preventDefault();
    perfilPanel.style.display = 'none';
    if (reservasPanel.style.display === 'none') {
      reservasPanel.style.display = 'block';
      renderReservas();
    } else {
      reservasPanel.style.display = 'none';
    }
  });

  sidebarPerfil.addEventListener('click', function (e) {
    e.preventDefault();
    reservasPanel.style.display = 'none';
    if (perfilPanel.style.display === 'none') {
      perfilPanel.style.display = 'block';
      populateEditForm();
    } else {
      perfilPanel.style.display = 'none';
    }
  });

  function populateEditForm() {
    var session = getSession();
    if (!session) return;
    document.getElementById('edit-nombre').value = session.name || '';
    document.getElementById('edit-paterno').value = session.apPaterno || '';
    document.getElementById('edit-materno').value = session.apMaterno || '';
    document.getElementById('edit-email').value = session.email || '';
    document.getElementById('edit-phone').value = session.phone || '';
    document.getElementById('edit-direccion').value = session.direccion || '';
    document.getElementById('edit-pass').value = '';
    document.getElementById('edit-profile-success').style.display = 'none';
  }

  formEditProfile.addEventListener('submit', function (e) {
    e.preventDefault();
    var session = getSession();
    if (!session) return;

    var users = getUsers();
    var idx = users.findIndex(function (u) {
      return u.email === session.email;
    });

    if (idx > -1) {
      var newEmail = document.getElementById('edit-email').value.trim().toLowerCase();
      if (newEmail !== session.email && users.find(function (u) { return u.email === newEmail; })) {
        alert('El correo electrónico ya está en uso por otra cuenta.');
        return;
      }

      users[idx].name = document.getElementById('edit-nombre').value.trim();
      users[idx].apPaterno = document.getElementById('edit-paterno').value.trim();
      users[idx].apMaterno = document.getElementById('edit-materno').value.trim();
      users[idx].email = newEmail;
      users[idx].phone = document.getElementById('edit-phone').value.trim();
      users[idx].direccion = document.getElementById('edit-direccion').value.trim();

      var newPass = document.getElementById('edit-pass').value;
      if (newPass) users[idx].password = newPass;

      saveUsers(users);
      saveSession(users[idx]);
      sidebarName.textContent = users[idx].name + ' ' + users[idx].apPaterno;
      sidebarEmail.textContent = users[idx].email;
      updateUI();

      var successMsg = document.getElementById('edit-profile-success');
      successMsg.style.display = 'block';
      setTimeout(function () {
        successMsg.style.display = 'none';
      }, 3000);
    }
  });

  function renderReservas() {
    var session = getSession();
    if (!session) return;

    var users = getUsers();
    var user = users.find(function (u) {
      return u.email === session.email;
    });
    var reservas = user ? user.reservations || [] : [];

    var actualEl = document.getElementById('reserva-actual-content');
    var historialEl = document.getElementById('historial-reservas');

    if (reservas.length === 0) {
      actualEl.innerHTML = '<p class="no-reserva">No tienes una reserva activa.</p>';
      historialEl.innerHTML = '<p class="no-reserva">Aún no tienes reservaciones pasadas.</p>';
      return;
    }

    var actual = reservas[reservas.length - 1];
    actualEl.innerHTML = renderReservaCard(actual, true, reservas.length - 1);

    if (reservas.length > 1) {
      var html = '';
      for (var i = reservas.length - 2; i >= 0; i--) {
        html += renderReservaCard(reservas[i], false, null);
      }
      historialEl.innerHTML = html;
    } else {
      historialEl.innerHTML = '<p class="no-reserva">No tienes reservaciones anteriores.</p>';
    }
  }

  function renderReservaCard(r, isCurrent, cancelIdx) {
    var title =
      r.rooms && r.rooms.length > 1 ? r.rooms.length + ' habitaciones' : r.room || 'Habitación';
    var roomsLines =
      r.rooms && r.rooms.length > 1
        ? r.rooms
            .map(function (x) {
              return (
                '<div class="reserva-detail reserva-room-line"><i class="fa-solid fa-door-open"></i> ' +
                x.name +
                (x.precio ? ' <span class="reserva-room-mini">' + x.precio + '</span>' : '') +
                '</div>'
              );
            })
            .join('')
        : '';
    return (
      '<div class="reserva-card' +
      (isCurrent ? ' actual' : '') +
      '">' +
      '<div class="reserva-card-header">' +
      '<span class="reserva-room-name"><i class="fa-solid fa-bed"></i> ' +
      title +
      '</span>' +
      (isCurrent ? '<span class="reserva-badge-active">Activa</span>' : '') +
      '</div>' +
      roomsLines +
      '<div class="reserva-detail"><i class="fa-regular fa-calendar"></i> ' +
      (r.entrada || '—') +
      ' → ' +
      (r.salida || '—') +
      '</div>' +
      '<div class="reserva-detail"><i class="fa-solid fa-moon"></i> ' +
      (r.noches || 1) +
      ' noches</div>' +
      '<div class="reserva-detail"><i class="fa-solid fa-users"></i> ' +
      (r.adultos || 2) +
      ' adultos' +
      (r.ninos ? ', ' + r.ninos + ' niños' : '') +
      '</div>' +
      '<div class="reserva-detail reserva-price"><i class="fa-solid fa-tag"></i> ' +
      (r.precio || '—') +
      '</div>' +
      '<div class="reserva-date">Reservado: ' +
      (r.fecha || '—') +
      '</div>' +
      (isCurrent && cancelIdx !== undefined && cancelIdx !== null
        ? '<button type="button" class="btn-cancel-reserva-sidebar" data-reserva-idx="' +
          cancelIdx +
          '">Cancelar reserva</button>'
        : '') +
      '</div>'
    );
  }

  function cancelReservaAtIndex(idx) {
    var session = getSession();
    if (!session) return;
    var users = getUsers();
    var uix = users.findIndex(function (u) {
      return u.email === session.email;
    });
    if (uix < 0) return;
    var list = users[uix].reservations || [];
    if (idx < 0 || idx >= list.length) return;
    if (!window.confirm('¿Cancelar esta reserva? Esta acción no se puede deshacer.')) return;
    list.splice(idx, 1);
    users[uix].reservations = list;
    saveUsers(users);
    saveSession(users[uix]);
    renderReservas();
  }

  if (reservasPanel) {
    reservasPanel.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-cancel-reserva-sidebar');
      if (!btn) return;
      e.preventDefault();
      var idx = parseInt(btn.getAttribute('data-reserva-idx'), 10);
      if (isNaN(idx)) return;
      cancelReservaAtIndex(idx);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    }
  });

  updateUI();
})();
