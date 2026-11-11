// Animasi & partikel. Selalu aktif — lihat catatan di css/responsive.css.
const Anim = (() => {
  const reduced = false;

  function random(min, max) { return Math.random() * (max - min) + min; }

  // Dust: 20 partikel (CSS menyembunyikan sebagian di HP)
  const dust = document.getElementById("dust");
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("i");
    p.style.left = random(0, 100) + "vw";
    p.style.top = random(60, 110) + "vh";
    p.style.animationDuration = random(14, 30) + "s";
    p.style.animationDelay = -random(0, 30) + "s";
    p.style.width = p.style.height = random(2, 4) + "px";
    dust.appendChild(p);
  }

  // Floaties birthday: bintang & balon kecil
  const floaties = document.querySelector(".floaties");
  const glyphs = ["✦", "✧", "♡", "🎈", "✦", "🎈", "✧", "♡", "✦", "🎈", "✧", "✦"];
  glyphs.forEach((g) => {
    const s = document.createElement("span");
    s.textContent = g;
    s.style.left = random(2, 94) + "%";
    s.style.fontSize = random(0.8, 1.6) + "rem";
    s.style.animationDuration = random(12, 24) + "s";
    s.style.animationDelay = -random(0, 24) + "s";
    floaties.appendChild(s);
  });

  // Starfield ending
  const stars = document.getElementById("starfield");
  for (let i = 0; i < 32; i++) {
    const s = document.createElement("i");
    s.style.left = random(0, 100) + "%";
    s.style.top = random(0, 100) + "%";
    s.style.animationDelay = random(0, 3.5) + "s";
    s.style.animationDuration = random(2.5, 5) + "s";
    stars.appendChild(s);
  }

  // Polaroid: rotasi acak kecil
  function tiltPolaroids() {
    document.querySelectorAll(".polaroid").forEach((card) => {
      card.style.setProperty("--tilt", random(-4, 4).toFixed(1) + "deg");
    });
  }

  // Munculkan baris satu per satu (subtitle film) — pelan agar senapas lagu.
  let lineTimers = [];
  function revealLines(container, delay = 1100) {
    lineTimers.forEach(clearTimeout);
    lineTimers = [];
    const items = container.querySelectorAll("p, .ending-signature, .ending-quote, .ending-fin");
    items.forEach((el) => el.classList.remove("is-shown"));
    if (reduced) { items.forEach((el) => el.classList.add("is-shown")); return; }
    items.forEach((el, i) => {
      lineTimers.push(setTimeout(() => el.classList.add("is-shown"), 400 + i * delay));
    });
  }

  // Typing surat per paragraf; mengembalikan fungsi "lewati".
  function typeLetter(container, paragraphs, onDone) {
    container.innerHTML = "";
    if (reduced) {
      paragraphs.forEach((t) => { const p = document.createElement("p"); p.textContent = t; container.appendChild(p); });
      onDone && onDone();
      return () => {};
    }
    let pi = 0, ci = 0, timer = null, finished = false;
    let pEl = null;

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      container.innerHTML = "";
      paragraphs.forEach((t) => { const p = document.createElement("p"); p.textContent = t; container.appendChild(p); });
      onDone && onDone();
    }

    function step() {
      if (pi >= paragraphs.length) { finish(); return; }
      if (!pEl) { pEl = document.createElement("p"); container.appendChild(pEl); }
      const text = paragraphs[pi];
      pEl.textContent = text.slice(0, ++ci);
      if (ci >= text.length) { pi++; ci = 0; pEl = null; timer = setTimeout(step, 800); }
      else timer = setTimeout(step, 28);
    }
    step();
    return finish;
  }

  // ---------- Bintang jatuh saat klik "Start the Journey" ----------
  function shootingStars() {
    const wrap = document.getElementById("shooting-stars");
    if (!wrap || reduced) return;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i");
      s.style.left = random(55, 100) + "vw";
      s.style.top = random(-5, 30) + "vh";
      s.style.animationDuration = random(2.2, 4.2) + "s";
      s.style.animationDelay = random(0, 1.6) + "s";
      wrap.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  // ---------- Interaksi kursor: glow mengikuti pointer + tilt kartu ----------
  const glow = document.getElementById("cursor-glow");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (glow && finePointer && !reduced) {
    document.body.classList.add("has-pointer");
    let gx = 0, gy = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      raf = Math.abs(gx - cx) + Math.abs(gy - cy) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    window.addEventListener("pointermove", (e) => {
      gx = e.clientX; gy = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    // Tilt 3D halus pada kartu (polaroid & kotak hadiah)
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".polaroid, .gift-box");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "perspective(700px) rotateY(" + (px * 10).toFixed(2) + "deg) rotateX(" + (-py * 10).toFixed(2) + "deg) translateY(-6px)";
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".polaroid, .gift-box");
      if (card) card.style.transform = "";
    }, { passive: true });
  }

  // ---------- Scroll progress ----------
  const bar = document.getElementById("scroll-progress");
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("page:changed", update);
    update();
  }

  return { reduced, tiltPolaroids, revealLines, typeLetter, shootingStars };
})();