// Render konten dari CONFIG + interaksi (polaroid, amplop, hadiah, chat rahasia).
(() => {
  const $ = (id) => document.getElementById(id);
// python -m http.server 8000 --directory D:\birthday
  // ---------- Helper ----------
  function photoNode(src, alt, label) {
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.loading = "lazy";
      return img;
    }
    const ph = document.createElement("div");
    ph.className = "photo-placeholder";
    ph.setAttribute("role", "img");
    ph.setAttribute("aria-label", alt + " (belum diisi)");
    ph.textContent = label || "✦ fotosoon ♡";
    return ph;
  }

  function paragraphs(container, texts, cls) {
    container.innerHTML = "";
    texts.forEach((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      if (cls) p.className = cls;
      container.appendChild(p);
    });
  }

  // ---------- Welcome ----------
  $("welcome-title").textContent = CONFIG.welcome.title;
  $("welcome-subtitle").textContent = CONFIG.welcome.subtitle;
  $("btn-start").textContent = CONFIG.welcome.startButton;
  $("welcome-recipient").textContent = CONFIG.recipientName;
  $("btn-start").addEventListener("click", (e) => {
    // Cegah navigasi langsung; bintang jatuh dulu, teks menyusul.
    e.stopPropagation();
    Anim.shootingStars();
    setTimeout(() => Nav.go("birthday"), 4000);
  });

  // ---------- Birthday ----------
  $("birthday-greeting").textContent = CONFIG.birthday.greeting;
  paragraphs($("birthday-lines"), CONFIG.birthday.lines);

  // ---------- Memories ----------
  const gallery = $("gallery");
  const lightbox = $("lightbox");
  CONFIG.memories.forEach((m, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "polaroid";
    card.setAttribute("aria-label", "Lihat " + m.alt);
    card.appendChild(photoNode(m.src, m.alt, "foto " + (i + 1)));
    const cap = document.createElement("span");
    cap.className = "polaroid-caption";
    cap.textContent = m.caption;
    card.appendChild(cap);
    card.addEventListener("click", () => {
      const media = $("lightbox-media");
      media.innerHTML = "";
      media.appendChild(photoNode(m.src, m.alt, "foto " + (i + 1)));
      $("lightbox-caption").textContent = m.caption;
      openDialog(lightbox, card);
    });
    gallery.appendChild(card);
  });
  Anim.tiltPolaroids();

  // ---------- Letter ----------
  $("letter-recipient").textContent = CONFIG.recipientName;
  $("letter-sender").textContent = CONFIG.senderName;
  const envelope = $("envelope");
  const stage = $("envelope-stage");
  const paper = $("letter-paper");
  const skipBtn = $("btn-skip-typing");
  let skipTyping = null;
  let letterOpened = false;

  function openLetter() {
    if (letterOpened) return;
    letterOpened = true;
    envelope.classList.add("is-open");
    envelope.setAttribute("aria-expanded", "true");
    setTimeout(() => {
      stage.classList.add("is-done");
      paper.hidden = false;
      skipBtn.hidden = false;
      skipTyping = Anim.typeLetter($("letter-body"), CONFIG.letter, () => { skipBtn.hidden = true; });
    }, Anim.reduced ? 0 : 900);
  }
  envelope.addEventListener("click", openLetter);
  skipBtn.addEventListener("click", () => skipTyping && skipTyping());

  // ---------- Gifts ----------
  const giftGrid = $("gift-grid");
  const giftModal = $("gift-modal");
  const nextBtn = $("btn-gifts-next");
  const counter = $("gift-counter");
  const opened = new Set();
  const icons = { sky: "☁️", sea: "🌊", small: "✨" };

  function updateCounter() {
    counter.textContent = opened.size + "/" + CONFIG.gifts.length + " terbuka";
    nextBtn.disabled = opened.size === 0;
  }

  function makeGiftBox(title, icon, isOpenable) {
    const box = document.createElement("button");
    box.type = "button";
    box.className = "gift-box";
    box.innerHTML =
      '<span class="gift-opened-mark" aria-hidden="true">✓ terbuka</span>' +
      '<span class="gift-visual" aria-hidden="true"><span class="gift-lid"></span>' +
      '<span class="gift-body-box"></span><span class="gift-icon">' + icon + "</span></span>" +
      '<span class="gift-title"></span>';
    box.querySelector(".gift-title").textContent = title;
    box.setAttribute("aria-label", "Buka " + title);
    return box;
  }

  // Buket bunga kartun (SVG): 5 bunga warna-warni dalam pot, mekar saat modal dibuka.
  function flowerMarkup() {
    const COLORS = [
      ["#fbcfe8", "#ec4899"], // pink
      ["#bfdbfe", "#3b82f6"], // biru
      ["#fef3c7", "#f59e0b"], // kuning
      ["#ddd6fe", "#8b5cf6"], // ungu
      ["#fecdd3", "#f43f5e"], // merah muda
    ];
    const flowers = [
      { x: 100, y: 78, r: 1.15 },
      { x: 70, y: 96, r: 0.95 },
      { x: 130, y: 96, r: 0.95 },
      { x: 52, y: 122, r: 0.8 },
      { x: 148, y: 122, r: 0.8 },
    ]
      .map((f, i) => {
        const [light, dark] = COLORS[i];
        const petals = Array.from({ length: 8 }, (_, p) =>
          '<circle cx="0" cy="-16" r="10" fill="' + light + '" stroke="' + dark + '" stroke-width="2" transform="rotate(' + p * 45 + ')"/>'
        ).join("");
        return (
          '<g class="bq-flower bq-f' + i + '" style="--d:' + (i * 0.12).toFixed(2) + 's">' +
          '<path d="M' + f.x + " " + f.y + " L100 168" + '" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          '<g transform="translate(' + f.x + "," + f.y + ") scale(" + f.r + ')">' +
          petals +
          '<circle r="8" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>' +
          "</g></g>"
        );
      })
      .join("");
    return (
      '<svg class="bouquet" viewBox="0 0 200 210" aria-hidden="true">' +
      '<path d="M60 118 Q40 140 52 160" stroke="#22c55e" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="46" cy="150" rx="10" ry="6" fill="#4ade80" transform="rotate(-30 46 150)"/>' +
      '<path d="M140 118 Q160 140 148 160" stroke="#22c55e" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="154" cy="150" rx="10" ry="6" fill="#4ade80" transform="rotate(30 154 150)"/>' +
      flowers +
      '<path d="M62 150 L138 150 L128 200 L72 200 Z" fill="#fb923c" stroke="#ea580c" stroke-width="3"/>' +
      '<rect x="56" y="144" width="88" height="14" rx="7" fill="#fdba74" stroke="#ea580c" stroke-width="3"/>' +
      '<path d="M84 172 q16 10 32 0" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>' +
      "</svg>"
    );
  }

  // Kue ulang tahun kartun (SVG): lilin menyala saat modal dibuka, padam saat diklik.
  function cakeMarkup() {
    // 3 lilin untuk 3 tingkat kue.
                    const candles = [
                    { x: 82, w: 5, c1: "#bfdbfe", c2: "#60a5fa" },
                    { x: 100, w: 6, c1: "#fbcfe8", c2: "#f472b6" },
                    { x: 118, w: 5, c1: "#fef3c7", c2: "#fbbf24" },
                ];
                const candlesHtml = candles.map((c, i) => {
                        const stripes = Array.from({ length: 4 }, (_, s) =>
                                  '<path d="M' + (c.x - c.w / 2) + ' ' + (34 + s * 4) + ' L' + (c.x + c.w / 2) + ' ' + (34 + s * 4) + '" stroke="' + (s % 2 ? "#94a3b8" : "#ffffff") + '" stroke-width="1"/>'
                    ).join("");
                    return (
                      '<g class="cake-candle" data-candle="' + i + '" role="button" tabindex="0" aria-label="Tiup lilin ' + (i + 1) + '">' +
                      '<rect x="' + (c.x - 5) + '" y="12" width="10" height="42" fill="transparent"/>' +
                      '<rect x="' + (c.x - c.w / 2) + '" y="30" width="' + c.w + '" height="22" rx="' + (c.w / 2) + '" fill="url(#candle-grad-' + i + ')" pointer-events="none"/>' +
                      stripes +
                      '<g class="cake-flame">' +
                      '<ellipse cx="' + c.x + '" cy="20" rx="4" ry="7" fill="url(#flame-grad)"/>' +
                      '<ellipse cx="' + c.x + '" cy="24" rx="2" ry="4" fill="#fff7ed"/>' +
                      '<ellipse cx="' + c.x + '" cy="25.5" rx="1" ry="2.2" fill="#fbbf24"/>' +
                      '<line x1="' + c.x + '" y1="30" x2="' + c.x + '" y2="25" stroke="#7a4a2b" stroke-width="1.5"/>' +
                      '</g>' +
                      '<text class="cake-smoke" x="' + (c.x - 6) + '" y="10" font-size="13">💨</text>' +
                      '</g>'
                    );
                  }).join("");

          // Glaze frosting pink menetes dari pinggir atas tiap tingkat.
                    const dripHeights = [14, 9, 18, 11, 16, 8, 14, 10, 15, 9, 12, 7];
                    const dripHtml = dripHeights.map((len, i) => {
                                const x = Math.round(77 + i * 4.3);
                                return '<rect x="' + (x - 2.2) + '" y="58" width="4.4" height="' + len + '" rx="2.2" fill="url(#frosting)" pointer-events="none"/>';
                    }).join("");

          // Hiasan: taburan sprinkles, ruffle frosting, dan bunga rosette.
                    const sprinkleColors = ["#f472b6", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399", "#fb7185"];
                    const sprinkles = [
                      { x: 70, y: 88, a: 20 }, { x: 80, y: 96, a: 60 }, { x: 92, y: 86, a: 0 },
                      { x: 104, y: 94, a: 40 }, { x: 116, y: 88, a: 70 }, { x: 126, y: 96, a: 15 },
                      { x: 86, y: 90, a: 90 }, { x: 110, y: 84, a: 30 },
                    ];
                    const sprinkleHtml = sprinkles.map((s, i) =>
                      '<rect x="' + (s.x - 1.5) + '" y="' + (s.y - 4) + '" width="3" height="8" rx="1.5" fill="' + sprinkleColors[i % sprinkleColors.length] + '" transform="rotate(' + s.a + ' ' + s.x + ' ' + s.y + ')" pointer-events="none"/>'
                    ).join("");
                    const scallop = (cx, rx, cy, n, r) => Array.from({ length: n }, (_, i) => {
                      const x = cx - rx + (2 * rx * i) / (n - 1);
                      return '<circle cx="' + x.toFixed(1) + '" cy="' + cy + '" r="' + r + '" fill="#fff5f9" stroke="#f3c2d6" stroke-width="0.5" pointer-events="none"/>';
                    }).join("");
                    const rosette = (x, y, c) =>
                      '<g pointer-events="none">' +
                      '<circle cx="' + (x - 3) + '" cy="' + y + '" r="3" fill="' + c + '"/>' +
                      '<circle cx="' + (x + 3) + '" cy="' + y + '" r="3" fill="' + c + '"/>' +
                      '<circle cx="' + x + '" cy="' + (y - 3) + '" r="3" fill="' + c + '"/>' +
                      '<circle cx="' + x + '" cy="' + (y + 3) + '" r="3" fill="' + c + '"/>' +
                      '<circle cx="' + x + '" cy="' + y + '" r="2" fill="#ffffff"/>' +
                      '</g>';
                    const rosetteHtml = [
                      { x: 60, y: 120, c: "#f9a8d4" }, { x: 78, y: 124, c: "#fbcfe8" },
                      { x: 122, y: 124, c: "#fbcfe8" }, { x: 140, y: 120, c: "#f9a8d4" },
                    ].map(r => rosette(r.x, r.y, r.c)).join("");

          return (
            '<div class="cake" role="group" aria-label="Kue ulang tahun">' +
            '<svg viewBox="0 0 200 150">' +
              '<defs>' +
              '<linearGradient id="flame-grad" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="#fde68a"/><stop offset="0.55" stop-color="#fbbf24"/><stop offset="1" stop-color="#f97316"/>' +
              '</linearGradient>' +
              candles.map((c, i) =>
                '<linearGradient id="candle-grad-' + i + '" x1="0" y1="0" x2="1" y2="0">' +
                '<stop offset="0" stop-color="' + c.c1 + '"/><stop offset="1" stop-color="' + c.c2 + '"/>' +
                '</linearGradient>'
              ).join("") +
              '<linearGradient id="cake-body" x1="0" y1="0" x2="0" y2="1">' +
                                                    '<stop offset="0" stop-color="#fbe3ee"/><stop offset="1" stop-color="#f3c2d6"/>' +
              '</linearGradient>' +
                            '<linearGradient id="cake-rim" x1="0" y1="0" x2="0" y2="1">' +
                                                    '<stop offset="0" stop-color="#fef1f8"/><stop offset="1" stop-color="#f7d3e4"/>' +
              '</linearGradient>' +
                                          '<linearGradient id="frosting" x1="0" y1="0" x2="0" y2="1">' +
                                          '<stop offset="0" stop-color="#f9a8d4"/><stop offset="1" stop-color="#ec4899"/>' +
                            '</linearGradient>' +
                            '</defs>' +
              // Lingkaran cahaya lembut di belakang kue
                            '<circle class="cake-halo" cx="100" cy="80" r="68" fill="url(#flame-grad)" opacity="0.08" pointer-events="none"/>' +
                            // Piring
                                      '<ellipse cx="100" cy="134" rx="86" ry="9" fill="#f7e9e2" opacity="0.65"/>' +
                                      '<ellipse cx="100" cy="132" rx="70" ry="7" fill="#fdf6f1" opacity="0.9"/>' +
                                      // Tingkat bawah
                                      '<rect x="44" y="102" width="112" height="32" rx="8" fill="url(#cake-body)" stroke="#e9a8c3" stroke-width="1"/>' +
                                      '<ellipse cx="100" cy="102" rx="56" ry="9" fill="url(#cake-rim)"/>' +
                                      // Ruffle frosting di bawah tingkat bawah
                                      scallop(100, 56, 130, 15, 4.5) +
                                      // Tingkat tengah
                                      '<rect x="62" y="76" width="76" height="28" rx="7" fill="url(#cake-body)" stroke="#e9a8c3" stroke-width="1"/>' +
                                      '<ellipse cx="100" cy="76" rx="38" ry="7" fill="url(#cake-rim)"/>' +
                                      // Ruffle frosting di bawah tingkat tengah
                                      scallop(100, 38, 102, 11, 3.6) +
                                      // Tingkat atas
                                      '<rect x="74" y="52" width="52" height="26" rx="6" fill="url(#cake-body)" stroke="#e9a8c3" stroke-width="1"/>' +
                                      '<ellipse cx="100" cy="52" rx="26" ry="5" fill="url(#cake-rim)"/>' +
                                      '<ellipse cx="94" cy="50" rx="11" ry="2.5" fill="#ffffff" opacity="0.5"/>' +
                                      // Glaze frosting pink menetes dari tingkat atas
                                      '<rect x="74" y="52" width="52" height="6" rx="3" fill="url(#frosting)"/>' +
                                      dripHtml +
                                      // Taburan sprinkles di tingkat tengah
                                      sprinkleHtml +
                                      // Bunga rosette di dasar tingkat bawah
                                      rosetteHtml +
                        // Lilin
                        candlesHtml +
                                      '<path d="M44 134 L156 134" stroke="#e9a8c3" stroke-width="1.5"/>' +
                  '</svg>' +
        '<p class="cake-hint">Tiup lilinnya — ketuk tiap lilin untuk memadamkan. ✨</p>' +
        '</div>'
      );
    }

  CONFIG.gifts.forEach((g, i) => {
    const box = makeGiftBox(g.title, icons[g.icon] || "🎁");
    box.addEventListener("click", () => {
      box.classList.add("is-opened");
      opened.add(i);
      updateCounter();
      $("gift-modal-title").textContent = g.title;
      $("gift-modal-message").textContent = g.message;
      const photoWrap = $("gift-modal-photo");
      photoWrap.innerHTML = "";
      photoWrap.hidden = !("photo" in g);
      if ("photo" in g) photoWrap.appendChild(photoNode(g.photo, "Foto kejutan", "foto kejutan ♡"));
      const flowerWrap = $("gift-modal-flower");
      if (flowerWrap) {
        flowerWrap.innerHTML = "";
              flowerWrap.classList.toggle("is-sway", !!g.flowerPhoto);
              flowerWrap.hidden = !g.flowerPhoto;
              if (g.flowerPhoto) {
                const img = document.createElement("img");
                img.src = g.flowerPhoto;
                img.alt = "Buket bunga";
                img.loading = "lazy";
                flowerWrap.appendChild(img);
              }
            }
            const cakeWrap = $("gift-modal-cake");
            if (cakeWrap) {
              cakeWrap.innerHTML = "";
              cakeWrap.hidden = !g.cake;
              if (g.cake) {
                cakeWrap.innerHTML = cakeMarkup();
                cakeWrap.querySelectorAll(".cake-candle").forEach((candle) => {
                  const blowOut = () => candle.classList.add("is-out");
                  candle.addEventListener("click", blowOut);
                  candle.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blowOut(); }
                  });
                });
              }
            }
            openDialog(giftModal, box);
    });
    giftGrid.appendChild(box);
  });

  // Hadiah rahasia: chat WhatsApp
  const secret = CONFIG.secretGift;
  const secretModal = $("secret-modal");
  const secretBox = makeGiftBox("Ada yang mengucapkan sesuatu?!", " ");
  secretBox.classList.add("is-secret");
  secretBox.setAttribute("aria-label", "Buka hadiah rahasia");
  giftGrid.appendChild(secretBox);

  $("wa-name").textContent = secret.contactName;
  const avatar = $("wa-avatar");
  if (secret.photo) {
    const img = document.createElement("img");
    img.src = secret.photo;
    img.alt = "";
    avatar.appendChild(img);
  } else {
    avatar.textContent = secret.contactName.split(" ").map((w) => w[0]).join("").slice(0, 2);
  }

  let waTimers = [];
  function playSecretChat() {
    waTimers.forEach(clearTimeout);
    waTimers = [];
    const chat = $("wa-chat");
    chat.innerHTML = '<span class="wa-date">Hari ini</span>';
    const typing = document.createElement("div");
    typing.className = "wa-typing";
    typing.setAttribute("aria-label", secret.contactName + " sedang mengetik");
    typing.innerHTML = "<span></span><span></span><span></span>";

    let delay = 300;
    secret.messages.forEach((msg, i) => {
      if (!Anim.reduced) {
        waTimers.push(setTimeout(() => { chat.appendChild(typing); chat.scrollTop = chat.scrollHeight; }, delay));
        delay += 1100;
      }
      waTimers.push(setTimeout(() => {
        typing.remove();
        const b = document.createElement("div");
        b.className = "wa-bubble";
        b.textContent = msg;
        const time = document.createElement("span");
        time.className = "wa-time";
        time.textContent = "20.24";
        b.appendChild(time);
        chat.appendChild(b);
        requestAnimationFrame(() => b.classList.add("is-shown"));
        chat.scrollTop = chat.scrollHeight;
      }, delay));
      delay += 500;
    });
  }

  secretBox.addEventListener("click", () => {
    secretBox.classList.add("is-opened");
    openDialog(secretModal, secretBox);
    playSecretChat();
  });
  secretModal.addEventListener("close", () => { waTimers.forEach(clearTimeout); waTimers = []; });

  updateCounter();

  // ---------- Ending ----------
  paragraphs($("ending-body"), CONFIG.ending);
  $("ending-signature").textContent = CONFIG.endingSignature;
  $("ending-signature").classList.add("ending-signature");
  $("ending-quote").textContent = CONFIG.endingQuote;
  const endingPhoto = $("ending-photo");
  if (CONFIG.endingPhoto) {
    endingPhoto.querySelector("img").src = CONFIG.endingPhoto;
    endingPhoto.hidden = false;
  }
  const fin = document.querySelector(".ending-fin");
  $("ending-body").appendChild($("ending-signature"));
  $("btn-replay").addEventListener("click", () => {
    // Reset surat & hadiah agar pengalaman bisa diulang utuh.
    letterOpened = false;
    envelope.classList.remove("is-open");
    envelope.setAttribute("aria-expanded", "false");
    stage.classList.remove("is-done");
    paper.hidden = true;
    opened.clear();
    document.querySelectorAll(".gift-box").forEach((b) => b.classList.remove("is-opened"));
    updateCounter();
    Nav.go("welcome");
  });

  // ---------- Dialog helpers (Esc & klik luar menutup, fokus kembali) ----------
  let lastTrigger = null;
  function openDialog(dlg, trigger) {
    lastTrigger = trigger;
    dlg.showModal();
    const closeBtn = dlg.querySelector(".dialog-close, .btn, .wa-back");
    closeBtn && closeBtn.focus();
  }
  document.querySelectorAll("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => { lastTrigger && lastTrigger.focus(); });
  });
  $("lightbox-close").addEventListener("click", () => lightbox.close());
  $("gift-modal-close").addEventListener("click", () => giftModal.close());
  $("secret-back").addEventListener("click", () => secretModal.close());

  // ---------- Animasi per halaman ----------
  document.addEventListener("page:changed", (e) => {
    if (e.detail.id === "birthday") Anim.revealLines($("birthday-lines"), 1200);
    if (e.detail.id === "ending") {
          const photo = $("ending-photo");
          photo.classList.add("is-shown");
          Anim.revealLines($("ending-body"), 1800);
          const total = CONFIG.ending.length * 1800 + 1000;
          [$("ending-quote"), fin].forEach((el, i) => {
            setTimeout(() => el.classList.add("is-shown"), Anim.reduced ? 0 : total + i * 1600);
          });
        }
  });
  // Halaman awal saat load dengan hash langsung
  if (Nav.current === "birthday") Anim.revealLines($("birthday-lines"), 1200);
    if (Nav.current === "ending") {
      $("ending-photo").classList.add("is-shown");
      Anim.revealLines($("ending-body"), 1800);
    }
})();