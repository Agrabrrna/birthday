// Render konten dari CONFIG + interaksi (polaroid, amplop, hadiah, chat rahasia).
(() => {
  const $ = (id) => document.getElementById(id);

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
  const icons = { sky: "☁️", sea: "🌊", small: "✨", last: "🌙" };

  function updateCounter() {
    counter.textContent = opened.size + "/4 terbuka";
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
      { x: 58, y: 96, r: 0.95 },
      { x: 142, y: 96, r: 0.95 },
      { x: 34, y: 122, r: 0.8 },
      { x: 166, y: 122, r: 0.8 },
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
        flowerWrap.hidden = !g.flowerPhoto;
        if (g.flowerPhoto) {
          const img = document.createElement("img");
          img.src = g.flowerPhoto;
          img.alt = "Buket bunga";
          img.loading = "lazy";
          flowerWrap.appendChild(img);
        }
      }
      openDialog(giftModal, box);
    });
    giftGrid.appendChild(box);
  });

  // Hadiah rahasia: chat WhatsApp
  const secret = CONFIG.secretGift;
  const secretModal = $("secret-modal");
  const secretBox = makeGiftBox("Seseorang mengucapkan sesuatu?!", " ");
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
      Anim.revealLines($("ending-body"), 1800);
      const total = CONFIG.ending.length * 1800 + 1000;
      [$("ending-quote"), fin].forEach((el, i) => {
        setTimeout(() => el.classList.add("is-shown"), Anim.reduced ? 0 : total + i * 1600);
      });
    }
  });
  // Halaman awal saat load dengan hash langsung
  if (Nav.current === "birthday") Anim.revealLines($("birthday-lines"), 1200);
})();