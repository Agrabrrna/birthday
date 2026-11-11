// Navigasi hash: satu index.html, section tampil/sembunyi, tombol back browser bekerja.
const PAGES = ["welcome", "birthday", "memories", "letter", "gifts", "ending"];
const PAGE_LABELS = {
  welcome: "Sambutan",
  birthday: "Ucapan",
  memories: "Kenangan",
  letter: "Surat",
  gifts: "Hadiah",
  ending: "Penutup",
};

const Nav = (() => {
  const dotsNav = document.getElementById("dots");
  let current = "welcome";

  PAGES.forEach((id) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", PAGE_LABELS[id]);
    b.addEventListener("click", () => go(id));
    dotsNav.appendChild(b);
  });
  const dots = [...dotsNav.children];

  function render(id) {
    current = id;
    document.querySelectorAll(".page").forEach((p) => {
      const active = p.id === id;
      p.classList.toggle("is-active", active);
      p.toggleAttribute("hidden", !active);
    });
    dots.forEach((d, i) => d.setAttribute("aria-current", String(PAGES[i] === id)));
    document.body.classList.toggle("on-ending", id === "ending");
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent("page:changed", { detail: { id } }));
  }

  function go(id) {
    if (!PAGES.includes(id)) return;
    if (location.hash === "#" + id) render(id);
    else location.hash = id; // hashchange memanggil render
  }

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "") || "welcome";
    render(PAGES.includes(id) ? id : "welcome");
  });

  document.addEventListener("click", (e) => {
    const next = e.target.closest("[data-next]");
    const back = e.target.closest("[data-back]");
    if (next && !next.disabled) go(next.dataset.next);
    else if (back) go(back.dataset.back);
  });

  render(PAGES.includes(location.hash.slice(1)) ? location.hash.slice(1) : "welcome");

  return { go, get current() { return current; } };
})();