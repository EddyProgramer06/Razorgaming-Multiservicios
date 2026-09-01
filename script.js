// ============================================================
// MENÚ MÓVIL (botón ☰)
// ============================================================
// Cómo funciona:
// 1. En pantallas angostas (celular), el <nav> con los links
//    (Servicios, Horario, Galería, Contacto) está oculto por CSS
//    y el botón ☰ se muestra en su lugar.
// 2. Al tocar ☰, le agregamos la clase "nav-open" al <nav>.
//    Esa clase está definida en styles.css y hace que el menú
//    aparezca desplegado, como una lista vertical.
// 3. Al tocar ☰ de nuevo, o al tocar cualquier link del menú,
//    se quita la clase y el menú se cierra otra vez.
// ============================================================

const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('nav');

navToggle.addEventListener('click', function () {
  const abierto = nav.classList.toggle('nav-open');
  // Cambiamos el ícono: ☰ (cerrado) <-> ✕ (abierto)
  navToggle.textContent = abierto ? '✕' : '☰';
  // Mejora de accesibilidad: le dice a lectores de pantalla si está abierto
  navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
});

// Cerrar el menú automáticamente cuando tocan un link
// (por ejemplo, tocan "Horario" y el menú se cierra solo)
nav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    nav.classList.remove('nav-open');
    navToggle.textContent = '☰';
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// FORMULARIO DE CONTACTO -> ENVÍO A WHATSAPP
// ============================================================
// Cómo funciona:
// 1. La persona llena "Nombre" y "Mensaje" y presiona "Enviar mensaje".
// 2. JavaScript arma un texto con esos datos y lo mete en un link
//    especial de WhatsApp (wa.me), con TU número.
// 3. Se abre WhatsApp (la app en celular, o WhatsApp Web en PC)
//    con el mensaje YA ESCRITO en el chat contigo.
// 4. La persona solo debe presionar el botón de enviar DENTRO de WhatsApp.
//
// IMPORTANTE - Limitación real:
// No existe una forma gratuita de que el mensaje llegue a tu WhatsApp
// SIN que la persona presione enviar dentro de la app. Eso solo es
// posible con la API oficial de WhatsApp Business (de pago, con
// backend/servidor). Este método (wa.me) es el estándar gratuito
// que usan la mayoría de negocios pequeños.
// ============================================================

// 👉 Tu número en formato internacional, SIN el "+", SIN espacios ni guiones.
// República Dominicana = 1 + código de área + número.
// (829) 279-1746  ->  18292791746
const WHATSAPP_NUMBER = '18292791746';

const form = document.getElementById('contactForm');
const status = document.getElementById('form-status');

form.addEventListener('submit', function (e) {
  e.preventDefault(); // Evita que la página se recargue

  // 1. Tomamos lo que la persona escribió
  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // 2. Armamos el texto que va a llegar a tu WhatsApp
  const textoWhatsApp =
    `Hola, soy ${nombre}.\n` +
    `Mensaje: ${mensaje}\n` +
    `(Enviado desde el sitio web de Razor Multiservicios)`;

  // 3. Codificamos el texto para que sea válido dentro de una URL
  //    (los espacios, saltos de línea, tildes, etc. deben ir "codificados")
  const textoCodificado = encodeURIComponent(textoWhatsApp);

  // 4. Construimos el link de WhatsApp con tu número + el mensaje
  const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${textoCodificado}`;

  // 5. Avisamos al usuario en la página qué está pasando
  status.textContent = 'Abriendo WhatsApp... solo falta que presiones "Enviar" allá.';

  // 6. Abrimos WhatsApp en una nueva pestaña/ventana con el mensaje listo
  window.open(linkWhatsApp, '_blank');

  // 7. Limpiamos el formulario
  form.reset();
});
