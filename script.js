/* ═══════════════════════════════════════════════════════════
   RAZOR GAMING MULTISERVICIOS — Interacciones del sitio
   Vanilla JS, sin dependencias.
   ═══════════════════════════════════════════════════════════ */

'use strict';

// 👉 Número de WhatsApp en formato internacional, SIN "+", SIN espacios ni guiones.
// República Dominicana = 1 + código de área + número.
// (829) 279-1746  ->  18292791746
const WHATSAPP_NUMBER = '18292791746';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ══════════════ 1. PANTALLA DE CARGA ══════════════ */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const hide = () => loader.classList.add('done');
  window.addEventListener('load', () => setTimeout(hide, 500));
  // Red de seguridad por si "load" tarda mucho (imágenes pesadas)
  setTimeout(hide, 3000);
}


/* ══════════════ 2. HEADER: SOMBRA AL HACER SCROLL ══════════════ */
function initHeader() {
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ══════════════ 3. BARRA DE PROGRESO DE SCROLL ══════════════ */
function initProgressBar() {
  const bar = $('#progressBar');
  let ticking = false;

  const update = () => {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const pct = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}


/* ══════════════ 4. MENÚ MÓVIL ══════════════ */
// En celular el <nav> está translated fuera de pantalla por CSS.
// Al tocar ☰ le ponemos la clase "open" para que se deslice, y
// mostramos un overlay oscuro detrás para poder cerrarlo tocando fuera.
function initNav() {
  const nav     = $('#nav');
  const toggle  = $('#navToggle');
  const overlay = $('#navOverlay');
  if (!nav || !toggle) return;

  const setOpen = (abierto) => {
    nav.classList.toggle('open', abierto);
    toggle.classList.toggle('open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
    toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    overlay.hidden = !abierto;
    document.body.classList.toggle('no-scroll', abierto);
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  overlay.addEventListener('click', () => setOpen(false));

  // Cerrar al tocar cualquier link
  $$('a', nav).forEach((link) => link.addEventListener('click', () => setOpen(false)));

  // Cerrar si el celular se gira a pantalla grande (vuelve el nav horizontal)
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
}


/* ══════════════ 5. LINK ACTIVO EN EL NAV SEGÚN LA SECCIÓN ══════════════ */
function initActiveLink() {
  const links = $$('#nav a[href^="#"]').filter((a) => a.getAttribute('href').length > 1);
  const secciones = links
    .map((a) => $(a.getAttribute('href')))
    .filter(Boolean);

  if (!secciones.length) return;

  const marcar = (id) => {
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  };

  const obs = new IntersectionObserver((entradas) => {
    // Si varias secciones se ven al mismo tiempo, gana la más cercana al centro
    const visibles = entradas.filter((e) => e.isIntersecting);
    if (!visibles.length) return;
    const mejor = visibles.reduce((a, b) => (Math.abs(b.boundingClientRect.top) < Math.abs(a.boundingClientRect.top) ? b : a));
    marcar(mejor.target.id);
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  secciones.forEach((s) => obs.observe(s));
}


/* ══════════════ 6. REVELAR SECCIONES AL HACER SCROLL ══════════════ */
function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }

  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      o.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach((el) => obs.observe(el));
}


/* ══════════════ 7. CONTADORES ANIMADOS (hero stats) ══════════════ */
function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const animar = (el) => {
    const objetivo = parseInt(el.dataset.to, 10);
    const sufijo  = el.dataset.suffix || '';
    const duracion = 1500;
    const inicio = performance.now();

    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      // "easeOutExpo": arranca rápido y frena suave
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = Math.round(objetivo * eased) + sufijo;
      if (t < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach((el) => { el.textContent = el.dataset.to + (el.dataset.suffix || ''); });
    return;
  }

  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      animar(e.target);
      o.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => obs.observe(el));
}


/* ══════════════ 8. HORARIO: ¿ABIERTO O CERRADO AHORA? ══════════════ */
// Se calcula con la hora local de la persona (República Dominicana,
// UTC-4). Definimos el mismo horario que se muestra en la página.
const HORARIO = [
  { dias: [1, 2, 3, 4, 5], desde: 15, hasta: 22 }, // Lunes a Viernes: 3 PM - 10 PM
  { dias: [6],           desde: 15, hasta: 22 }, // Sábado:          3 PM - 10 PM
  { dias: [0],           desde: 8,  hasta: 22 }  // Domingo:         8 AM - 10 PM
];

// 15 -> "3:00 PM"
function formatoHora(h) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ':00 ' + suffix;
}

const NOMBRE_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function initStatus() {
  const badge = $('#statusBadge');
  const texto = $('#statusText');
  if (!badge || !texto) return;

  const revisar = () => {
    const ahora = new Date();
    const dia = ahora.getDay();
    const hora = ahora.getHours() + ahora.getMinutes() / 60;

    const abierto = HORARIO.some((r) => r.dias.includes(dia) && hora >= r.desde && hora < r.hasta);

    badge.classList.toggle('closed', !abierto);

    if (abierto) {
      texto.textContent = 'Abierto ahora';
      return;
    }

    // Buscamos el próximo momento de apertura para dar un mensaje útil
    for (let i = 0; i < 8; i++) {
      const d = (dia + i) % 7;
      const rango = HORARIO.find((r) => r.dias.includes(d));
      if (!rango) continue;

      // Hoy solo sirve si todavía no empezó el turno
      if (i === 0 && hora >= rango.hasta) continue;

      const cuando = i === 0 ? 'hoy' : (i === 1 ? 'mañana' : NOMBRE_DIA[d].toLowerCase());
      texto.textContent = 'Cerrado ahora · Abre ' + cuando + ' ' + formatoHora(rango.desde);
      return;
    }

    texto.textContent = 'Cerrado ahora';
  };

  revisar();
  setInterval(revisar, 60000);
}


/* ══════════════ 9. GALERÍA CON LIGHTBOX ══════════════ */
function initLightbox() {
  const box     = $('#lightbox');
  const img     = $('#lbImg');
  const caption = $('#lbCaption');
  const btnPrev = $('#lbPrev');
  const btnNext = $('#lbNext');
  const btnClose = $('#lbClose');
  if (!box) return;

  const thumbs = $$('.g-item');
  let indice = 0;

  const mostrar = (i) => {
    const total = thumbs.length;
    indice = (i + total) % total;

    const miniatura = $('img', thumbs[indice]);
    if (!miniatura) return;

    // Recreamos el <img> para disparar la animación de entrada
    img.src = miniatura.src;
    img.alt = miniatura.alt;
    caption.textContent = miniatura.alt;

    img.style.animation = 'none';
    void img.offsetWidth; // forzamos reflow
    img.style.animation = '';
  };

  const abrir = (i) => {
    mostrar(i);
    box.hidden = false;
    document.body.classList.add('no-scroll');
    btnClose.focus();
  };

  const cerrar = () => {
    box.hidden = true;
    document.body.classList.remove('no-scroll');
  };

  thumbs.forEach((t) => t.addEventListener('click', () => abrir(parseInt(t.dataset.index, 10))));

  btnPrev.addEventListener('click', () => mostrar(indice - 1));
  btnNext.addEventListener('click', () => mostrar(indice + 1));
  btnClose.addEventListener('click', cerrar);

  // Tocar el fondo oscuro (fuera de la foto) también cierra
  box.addEventListener('click', (e) => {
    if (e.target === box) cerrar();
  });

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    if (e.key === 'ArrowRight') mostrar(indice + 1);
  });

  // Deslizar con el dedo (móvil)
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) mostrar(dx < 0 ? indice + 1 : indice - 1);
    x0 = null;
  });
}


/* ══════════════ 10. FAQ: SOLO UN ITEM ABIERTO A LA VEZ ══════════════ */
// La animación la hace CSS con <details>, pero cerramos los demás
// para que el acordeón no se convierta en una columna larga.
function initFaq() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((otro) => { if (otro !== item) otro.open = false; });
    });
  });
}


/* ══════════════ 11. FORMULARIO -> WHATSAPP ══════════════ */
// IMPORTANTE - Limitación real:
// No existe forma gratuita de que el mensaje llegue a tu WhatsApp SIN que
// la persona presione "Enviar" dentro de la app. Eso requiere la API oficial
// de WhatsApp Business (de pago, con servidor). El método wa.me es el
// estándar gratuito que usan casi todos los negocios pequeños.
function initForm() {
  const form   = $('#contactForm');
  const status = $('#form-status');
  if (!form) return;

  const campoNombre   = $('#nombre');
  const campoMensaje  = $('#mensaje');

  // Quitar el borde rojo al escribir
  [campoNombre, campoMensaje].forEach((c) => {
    c.addEventListener('input', () => c.classList.remove('invalid'));
  });

  // Botones que ya traen un mensaje pre-escrito (ej. "Reservar por WhatsApp")
  $$('[data-wa-prefill]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const texto = btn.dataset.waPrefill;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const nombre  = campoNombre.value.trim();
    const mensaje = campoMensaje.value.trim();

    status.classList.remove('error');

    // Validación simple antes de abrir WhatsApp
    if (!nombre || !mensaje) {
      status.classList.add('error');
      status.textContent = 'Escribe tu nombre y tu mensaje para continuar.';
      (nombre ? campoMensaje : campoNombre).classList.add('invalid');
      (nombre ? campoMensaje : campoNombre).focus();
      return;
    }

    const textoWhatsApp =
      `Hola, soy ${nombre}.\n` +
      `Mensaje: ${mensaje}\n` +
      `(Enviado desde el sitio web de Razor Multiservicios)`;

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoWhatsApp)}`;

    status.textContent = 'Abriendo WhatsApp... solo falta que presiones "Enviar" allá.';
    window.open(link, '_blank');

    form.reset();
    setTimeout(() => { status.textContent = ''; }, 6000);
  });
}


/* ══════════════ 12. VARIOS ══════════════ */
function initMisc() {
  // Año del footer siempre actualizado
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // El botón de WhatsApp aparece completo al hacer scroll
  const wa = $('#waFloat');
  if (wa) {
    const marcarWa = () => wa.classList.toggle('compacto', window.scrollY < 420);
    marcarWa();
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => { marcarWa(); ticking = false; });
      ticking = true;
    }, { passive: true });
  }
}


/* ══════════════ ARRANQUE ══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initProgressBar();
  initNav();
  initActiveLink();
  initReveal();
  initCounters();
  initStatus();
  initLightbox();
  initFaq();
  initForm();
  initMisc();
});
