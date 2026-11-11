// Animasi & partikel. Semua dekorasi dimatikan otomatis oleh CSS prefers-reduced-motion.
const Anim = (() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Munculkan baris satu per satu (subtitle film)
  let lineTimers = [];
  function revealLines(container, delay = 700) {
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
      if (ci >= text.length) { pi++; ci = 0; pEl = null; timer = setTimeout(step, 450); }
      else timer = setTimeout(step, 18);
    }
    step();
    return finish;
  }

  return { reduced, tiltPolaroids, revealLines, typeLetter };
})();