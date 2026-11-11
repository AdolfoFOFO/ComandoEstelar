/* ============================================================
   CONFIGURACIÓN DEL EQUIPO — edita aquí tus datos
   ============================================================ */
const CONFIG = {
  // Fecha del próximo lanzamiento (hora de Sinaloa, UTC-7). Formato AAAA-MM-DDTHH:MM:SS-07:00
  lanzamiento: "2026-12-15T09:00:00-07:00",
  textoLanzamiento: "Despegue de la próxima misión en:",
  // Deja vacío ("") lo que no uses; solo se muestran los que tengan dato.
  contacto: {
    correo: "",      // ej. "equipo03@ejemplo.com"
    instagram: "",   // ej. "https://instagram.com/tu_usuario"
    facebook: "",    // ej. "https://facebook.com/tu_pagina"
    github: "",      // ej. "https://github.com/tu_usuario"
    whatsapp: ""     // ej. "https://wa.me/521667XXXXXXX"
  }
};

/* ============================================================
   Utilidades
   ============================================================ */
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (a, b) => a + Math.random() * (b - a);

/* ============================================================
   Estrellas (canvas)
   ============================================================ */
(function estrellas() {
  const canvas = document.getElementById("estrellas");
  const ctx = canvas.getContext("2d");
  let w, h, dpr, lista = [];

  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const n = Math.round((innerWidth * innerHeight) / 7000);
    lista = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: rand(0.4, 1.8) * dpr, f: rand(0, Math.PI * 2), v: rand(0.4, 1.6),
      c: ["#ffffff", "#ffffff", "#b866ff", "#5cff7e"][Math.floor(Math.random() * 4)]
    }));
    if (sinMovimiento) pintar(0);
  }

  function pintar(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of lista) {
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.f + t * 0.001 * s.v));
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!sinMovimiento) requestAnimationFrame(pintar);
  }

  addEventListener("resize", medir);
  medir();
  if (!sinMovimiento) requestAnimationFrame(pintar);
})();

/* ============================================================
   Cohetes de fondo (diseño original, parodia de cadete espacial)
   ============================================================ */
(function cohetes() {
  const capa = document.getElementById("cohetes");
  let uid = 0;

  // Cohete apuntando hacia arriba: cuerpo blanco, aletas verdes, ventana morada, llama morada y blanca.
  function svgCohete() {
    const id = "g" + uid++;
    return `
    <svg viewBox="0 0 80 190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="#cfd6f5"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#aab4e0"/></linearGradient>
        <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#b866ff"/><stop offset="1" stop-color="#9900ff" stop-opacity="0"/></linearGradient>
      </defs>
      <!-- llama -->
      <path d="M28 128 Q40 190 52 128 Q40 142 28 128Z" fill="url(#${id}f)"/>
      <path d="M34 128 Q40 168 46 128Z" fill="#fff" opacity=".9"/>
      <!-- aletas -->
      <path d="M22 92 L2 134 L22 124Z" fill="#00ff33" stroke="#050b24" stroke-width="3" stroke-linejoin="round"/>
      <path d="M58 92 L78 134 L58 124Z" fill="#00c928" stroke="#050b24" stroke-width="3" stroke-linejoin="round"/>
      <path d="M36 100 L40 140 L44 100Z" fill="#9900ff" stroke="#050b24" stroke-width="3" stroke-linejoin="round"/>
      <!-- cuerpo -->
      <path d="M40 4 C60 28 64 70 60 124 L20 124 C16 70 20 28 40 4Z" fill="url(#${id}c)" stroke="#050b24" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- punta verde -->
      <path d="M40 4 C47 13 51 22 53 32 L27 32 C29 22 33 13 40 4Z" fill="#00ff33" stroke="#050b24" stroke-width="3" stroke-linejoin="round"/>
      <!-- ventana -->
      <circle cx="40" cy="58" r="11" fill="#9900ff" stroke="#050b24" stroke-width="3.5"/>
      <circle cx="37" cy="54" r="3.5" fill="#fff" opacity=".85"/>
      <!-- franjas -->
      <rect x="21" y="88" width="38" height="6" fill="#00ff33" opacity=".95"/>
      <rect x="21" y="104" width="38" height="5" fill="#9900ff"/>
      <!-- tobera -->
      <path d="M28 124 L52 124 L48 134 L32 134Z" fill="#3b4373" stroke="#050b24" stroke-width="3" stroke-linejoin="round"/>
    </svg>`;
  }

  function lanzar(el, primera) {
    const W = innerWidth, H = innerHeight;
    const ancho = rand(26, 74);
    const alto = ancho * 190 / 80;
    el.style.width = ancho + "px";
    // Parte de abajo-izquierda y llega arriba-derecha, o al revés (espejo) para variar.
    const espejo = Math.random() < 0.4;
    const x0 = espejo ? rand(W * 0.5, W * 1.15) : rand(-W * 0.15, W * 0.5);
    const y0 = H + alto + rand(0, H * 0.3);
    const dx = (espejo ? -1 : 1) * rand(W * 0.5, W * 1.1);
    const dy = -(H + alto * 2 + rand(0, H * 0.4));
    const ang = Math.atan2(dx, -dy) * 180 / Math.PI;
    const dur = rand(9000, 22000) * (70 / ancho) ** 0.35;
    const t = (x, y) => `translate(${x}px, ${y}px) rotate(${ang}deg)`;
    const anim = el.animate(
      [{ transform: t(x0, y0) }, { transform: t(x0 + dx, y0 + dy) }],
      { duration: dur, delay: primera ? rand(0, 9000) : rand(500, 6000), easing: "cubic-bezier(.35,.05,.6,.9)", fill: "both" }
    );
    el.style.opacity = rand(0.55, 0.95);
    anim.onfinish = () => lanzar(el, false);
  }

  const cantidad = innerWidth < 700 ? 5 : 9;
  for (let i = 0; i < cantidad; i++) {
    const el = document.createElement("div");
    el.className = "cohete";
    el.innerHTML = svgCohete();
    capa.appendChild(el);
    if (sinMovimiento) {
      // Versión estática: cohetes quietos, inclinados, repartidos por el fondo
      const ancho = rand(30, 60);
      el.style.width = ancho + "px";
      el.style.opacity = 0.45;
      el.style.transform = `translate(${rand(0, innerWidth - 60)}px, ${rand(0, innerHeight - 140)}px) rotate(${rand(25, 55)}deg)`;
    } else {
      lanzar(el, true);
    }
  }
})();

/* ============================================================
   Cuenta regresiva
   ============================================================ */
(function cuenta() {
  const destino = new Date(CONFIG.lanzamiento).getTime();
  const ids = { d: "t-dias", h: "t-horas", m: "t-min", s: "t-seg" };
  const el = Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, document.getElementById(v)]));
  const texto = document.getElementById("lanzamiento-texto");
  const nota = document.getElementById("reloj-nota");
  const dos = n => String(n).padStart(2, "0");
  texto.textContent = CONFIG.textoLanzamiento;

  function tic() {
    const falta = destino - Date.now();
    if (isNaN(destino) || falta <= 0) {
      texto.textContent = "¡Misión en vuelo!";
      nota.textContent = "El cohete ya despegó. Pronto anunciaremos la siguiente fecha.";
      Object.values(el).forEach(e => (e.textContent = "00"));
      return false;
    }
    const s = Math.floor(falta / 1000);
    el.d.textContent = dos(Math.floor(s / 86400));
    el.h.textContent = dos(Math.floor((s % 86400) / 3600));
    el.m.textContent = dos(Math.floor((s % 3600) / 60));
    el.s.textContent = dos(s % 60);
    nota.textContent = "Fecha de despegue: " + new Date(destino).toLocaleString("es-MX", {
      dateStyle: "full", timeStyle: "short", timeZone: "America/Mazatlan"
    }) + " (hora de Sinaloa)";
    return true;
  }
  if (tic()) {
    const timer = setInterval(() => { if (!tic()) clearInterval(timer); }, 1000);
  }
})();

/* ============================================================
   Contacto
   ============================================================ */
(function contacto() {
  const lista = document.getElementById("redes");
  const c = CONFIG.contacto;
  const items = [
    [c.correo && "mailto:" + c.correo, "Correo"],
    [c.whatsapp, "WhatsApp"],
    [c.instagram, "Instagram"],
    [c.facebook, "Facebook"],
    [c.github, "GitHub"]
  ].filter(([href]) => href);

  if (!items.length) {
    lista.innerHTML = '<li>Pronto publicaremos aquí nuestros canales de contacto.</li>';
    return;
  }
  for (const [href, nombre] of items) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href; a.textContent = nombre;
    if (!href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    li.appendChild(a);
    lista.appendChild(li);
  }
})();

/* ============================================================
   Menú móvil y año
   ============================================================ */
(function menu() {
  const btn = document.querySelector(".barra__menu");
  const nav = document.getElementById("nav");
  btn.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    btn.setAttribute("aria-expanded", abierto);
    btn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", e => {
    if (e.target.tagName === "A") {
      nav.classList.remove("abierto");
      btn.setAttribute("aria-expanded", "false");
    }
  });
  document.getElementById("anio").textContent = new Date().getFullYear();
})();
