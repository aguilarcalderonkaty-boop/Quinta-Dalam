(function () {
  var cat = window.QD_ROOM_CATALOG;
  if (!cat) return;

  function ensureShell() {
    if (document.getElementById('qd-amenities-overlay')) return;

    document.body.insertAdjacentHTML(
      'beforeend',
      '<div class="qd-overlay" id="qd-amenities-overlay" aria-hidden="true">' +
        '<div class="qd-modal qd-modal-amenities">' +
        '<button type="button" class="qd-overlay-close" id="qd-amenities-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>' +
        '<h2 class="qd-modal-title" id="qd-amenities-title">Amenidades</h2>' +
        '<div class="qd-amenities-grid" id="qd-amenities-grid"></div>' +
        '</div>' +
        '</div>' +
        '<div class="qd-overlay qd-lightbox-overlay" id="qd-lightbox-overlay" aria-hidden="true">' +
        '<div class="qd-lightbox-inner">' +
        '<button type="button" class="qd-overlay-close" id="qd-lb-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>' +
        '<button type="button" class="qd-lb-nav qd-lb-prev" id="qd-lb-prev" aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>' +
        '<div class="qd-lb-main"><img src="" alt="" id="qd-lb-img"></div>' +
        '<button type="button" class="qd-lb-nav qd-lb-next" id="qd-lb-next" aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>' +
        '<div class="qd-lb-counter" id="qd-lb-counter"></div>' +
        '<div class="qd-lb-thumbs" id="qd-lb-thumbs"></div>' +
        '</div>' +
        '</div>'
    );

    document.getElementById('qd-amenities-close').addEventListener('click', closeAmenities);
    document.getElementById('qd-amenities-overlay').addEventListener('click', function (e) {
      if (e.target.id === 'qd-amenities-overlay') closeAmenities();
    });
    document.getElementById('qd-lb-close').addEventListener('click', closeLightbox);
    document.getElementById('qd-lightbox-overlay').addEventListener('click', function (e) {
      if (e.target.id === 'qd-lightbox-overlay') closeLightbox();
    });
    document.getElementById('qd-lb-prev').addEventListener('click', function () {
      lbStep(-1);
    });
    document.getElementById('qd-lb-next').addEventListener('click', function () {
      lbStep(1);
    });

    document.addEventListener('keydown', function (e) {
      if (document.getElementById('qd-lightbox-overlay').classList.contains('is-open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lbStep(-1);
        if (e.key === 'ArrowRight') lbStep(1);
      }
      if (document.getElementById('qd-amenities-overlay').classList.contains('is-open') && e.key === 'Escape') {
        closeAmenities();
      }
    });
  }

  var lbImages = [];
  var lbIndex = 0;

  function openAmenities(roomId) {
    var data = cat[roomId];
    if (!data) return;
    ensureShell();
    var title = document.getElementById('qd-amenities-title');
    var grid = document.getElementById('qd-amenities-grid');
    title.textContent = data.title || data.name;
    grid.innerHTML = '';
    (data.amenities || []).forEach(function (a) {
      var cell = document.createElement('div');
      cell.className = 'qd-amenity-cell';
      cell.innerHTML =
        '<i class="' + a.icon + '" aria-hidden="true"></i><span>' + escapeHtml(a.name) + '</span>';
      grid.appendChild(cell);
    });
    var ov = document.getElementById('qd-amenities-overlay');
    ov.classList.add('is-open');
    ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAmenities() {
    var ov = document.getElementById('qd-amenities-overlay');
    if (!ov) return;
    ov.classList.remove('is-open');
    ov.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function openLightbox(roomId) {
    var data = cat[roomId];
    if (!data || !data.gallery || !data.gallery.length) return;
    ensureShell();
    lbImages = data.gallery.slice();
    lbIndex = 0;
    var ov = document.getElementById('qd-lightbox-overlay');
    ov.classList.add('is-open');
    ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    buildThumbs();
    renderLb();
  }

  function closeLightbox() {
    var ov = document.getElementById('qd-lightbox-overlay');
    if (!ov) return;
    ov.classList.remove('is-open');
    ov.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderLb() {
    var img = document.getElementById('qd-lb-img');
    var c = document.getElementById('qd-lb-counter');
    if (!img || !lbImages.length) return;
    img.src = lbImages[lbIndex];
    img.alt = 'Foto ' + (lbIndex + 1);
    c.textContent = lbIndex + 1 + ' / ' + lbImages.length;
    var thumbs = document.querySelectorAll('#qd-lb-thumbs .qd-lb-thumb');
    thumbs.forEach(function (t, i) {
      t.classList.toggle('active', i === lbIndex);
    });
  }

  function buildThumbs() {
    var wrap = document.getElementById('qd-lb-thumbs');
    wrap.innerHTML = '';
    lbImages.forEach(function (src, i) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'qd-lb-thumb' + (i === lbIndex ? ' active' : '');
      t.innerHTML = '<img src="' + src + '" alt="">';
      t.addEventListener('click', function () {
        lbIndex = i;
        renderLb();
      });
      wrap.appendChild(t);
    });
  }

  function lbStep(d) {
    if (!lbImages.length) return;
    lbIndex = (lbIndex + d + lbImages.length) % lbImages.length;
    renderLb();
  }

  function bindClicks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('.js-qd-amenities');
      if (a) {
        e.preventDefault();
        var id = a.getAttribute('data-qd-room');
        if (id) openAmenities(id);
        return;
      }
      var g = e.target.closest('.js-qd-gallery');
      if (g) {
        e.preventDefault();
        var gid = g.getAttribute('data-qd-room');
        if (gid) openLightbox(gid);
      }
    });
  }

  function preselectRoomFromUrl() {
    var p = new URLSearchParams(window.location.search).get('room');
    if (!p) return;
    var cb = document.getElementById('room' + p);
    if (cb) {
      cb.checked = true;
      setTimeout(function () {
        var card = cb.nextElementSibling;
        if (card && card.scrollIntoView) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }
  }

  ensureShell();
  bindClicks();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preselectRoomFromUrl);
  } else {
    preselectRoomFromUrl();
  }

  window.QD_openAmenities = openAmenities;
  window.QD_openGallery = openLightbox;
})();
