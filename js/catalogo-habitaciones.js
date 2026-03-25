(function () {
  var base = [
    'img/NAV.jpg',
    'img/frontal-hotel.jpg',
    'img/quencio.jpg',
    'img/banner_contacto.jpg',
  ];

  function g(main) {
    var arr = [main];
    base.forEach(function (p) {
      if (p !== main) arr.push(p);
    });
    return arr;
  }

  window.QD_ROOM_CATALOG = {
    '201': {
      name: 'Suite Quencio',
      title: '201 · Suite Quencio',
      amenities: [
        { icon: 'fa-solid fa-hot-tub-person', name: 'Tina de hidromasaje' },
        { icon: 'fa-solid fa-tv', name: 'Smart TV 55"' },
        { icon: 'fa-solid fa-champagne-glasses', name: 'Mini bar premium' },
        { icon: 'fa-solid fa-couch', name: 'Sofá cama' },
        { icon: 'fa-solid fa-mountain-sun', name: 'Balcón / vistas a jardines' },
        { icon: 'fa-solid fa-mug-saucer', name: 'Cafetera' },
        { icon: 'fa-solid fa-vault', name: 'Caja fuerte' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
        { icon: 'fa-solid fa-snowflake', name: 'Climatización' },
        { icon: 'fa-solid fa-square-parking', name: 'Estacionamiento' },
      ],
      gallery: g('img/suite_quencio.jpg'),
    },
    '101': {
      name: '101 Tzintzuntzan',
      title: '101 · Tzintzuntzan',
      amenities: [
        { icon: 'fa-solid fa-door-open', name: 'Acceso al patio' },
        { icon: 'fa-solid fa-tv', name: 'TV' },
        { icon: 'fa-solid fa-mug-saucer', name: 'Cafetera' },
        { icon: 'fa-solid fa-shirt', name: 'Ropa de cama premium' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
        { icon: 'fa-solid fa-shower', name: 'Baño privado' },
      ],
      gallery: g('img/habitacion_tzintzuntzan.jpg'),
    },
    '102': {
      name: '102 Paracho',
      title: '102 · Paracho',
      amenities: [
        { icon: 'fa-solid fa-music', name: 'Detalle musical / maderas nobles' },
        { icon: 'fa-solid fa-bed', name: '2 camas individuales' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
        { icon: 'fa-solid fa-snowflake', name: 'Aire acondicionado' },
      ],
      gallery: g('img/habitacion_paracho.jpg'),
    },
    '103': {
      name: '103 Yunuen',
      title: '103 · Yunuen',
      amenities: [
        { icon: 'fa-solid fa-moon', name: 'Ambiente sereno' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_tzintzuntzan.jpg'),
    },
    '104': {
      name: '104 Pátzcuaro',
      title: '104 · Pátzcuaro',
      amenities: [
        { icon: 'fa-solid fa-fire', name: 'Iluminación íntima' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_morelia.jpg'),
    },
    '105': {
      name: '105 Coeneo',
      title: '105 · Coeneo',
      amenities: [
        { icon: 'fa-solid fa-wind', name: 'Ventilación natural' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_tzintzuntzan.jpg'),
    },
    '106': {
      name: '106 Janitzio',
      title: '106 · Janitzio',
      amenities: [
        { icon: 'fa-solid fa-bed', name: '2 camas individuales' },
        { icon: 'fa-solid fa-users', name: 'Ideal para acompañantes' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_paracho.jpg'),
    },
    '202': {
      name: '202 Morelia',
      title: '202 · Morelia',
      amenities: [
        { icon: 'fa-solid fa-archway', name: 'Acabados tipo cantera' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_morelia.jpg'),
    },
    '203': {
      name: '203 Tacámbaro',
      title: '203 · Tacámbaro',
      amenities: [
        { icon: 'fa-solid fa-sun', name: 'Buena iluminación' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_tzintzuntzan.jpg'),
    },
    '204': {
      name: '204 Uruapan',
      title: '204 · Uruapan',
      amenities: [
        { icon: 'fa-solid fa-moon', name: 'Vistas agradables' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/quencio.jpg'),
    },
    '205': {
      name: '205 Tlalpujahua',
      title: '205 · Tlalpujahua',
      amenities: [
        { icon: 'fa-solid fa-gem', name: 'Madera labrada' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_morelia.jpg'),
    },
    '206': {
      name: '206 Cuitzeo',
      title: '206 · Cuitzeo',
      amenities: [
        { icon: 'fa-solid fa-leaf', name: 'Ambiente tranquilo' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_tzintzuntzan.jpg'),
    },
    '207': {
      name: '207 Cuanajo',
      title: '207 · Cuanajo',
      amenities: [
        { icon: 'fa-solid fa-chair', name: 'Mobiliario artesanal' },
        { icon: 'fa-solid fa-bed', name: 'Cama matrimonial' },
        { icon: 'fa-solid fa-wifi', name: 'WiFi' },
      ],
      gallery: g('img/habitacion_morelia.jpg'),
    },
  };
})();
