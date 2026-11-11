// YouTube IFrame Player — musik tidak pernah reload karena berada di luar section.
(() => {
  let player = null;
  let ready = false;
  let pendingPlay = false;
  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const fallback = document.getElementById("music-fallback");
  const vinyl = document.getElementById("vinyl");

  // Klik "Start the Journey" = gesture user, jadi lagu boleh langsung diputar.
  // Jika player belum siap, putar begitu siap.
  function play() {
    if (ready) player.playVideo();
    else pendingPlay = true;
  }
  document.getElementById("btn-start").addEventListener("click", play);

  document.getElementById("music-title").textContent = CONFIG.music.title;
  fallback.href = CONFIG.music.fallbackUrl;

  function showFallback() {
    btnPlay.hidden = true;
    btnPause.hidden = true;
    fallback.hidden = false;
    if (vinyl) vinyl.hidden = true;
  }

  // Jika API tidak siap dalam 8 detik (koneksi buruk / diblokir), tampilkan cadangan.
  const watchdog = setTimeout(() => { if (!ready) showFallback(); }, 8000);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("yt-player", {
      videoId: CONFIG.music.videoId,
      width: 220,
      height: 124,
      playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, loop: 1, playlist: CONFIG.music.videoId },
      events: {
        onReady: () => {
          ready = true;
          clearTimeout(watchdog);
          btnPlay.addEventListener("click", () => player.playVideo());
          btnPause.addEventListener("click", () => player.pauseVideo());
          if (pendingPlay) { pendingPlay = false; player.playVideo(); }
        },
        onStateChange: (e) => {
          // loop:1 + playlist sudah mengulang otomatis; ini jaring pengaman bila gagal.
          if (e.data === YT.PlayerState.ENDED) { player.seekTo(0); player.playVideo(); return; }
          // Vinyl tetap berputar saat buffering/loop, berhenti hanya saat pause/berakhir.
          const spinning = e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING;
          btnPlay.hidden = spinning;
          btnPause.hidden = !spinning;
          if (vinyl) vinyl.classList.toggle("is-playing", spinning);
        },
        onError: showFallback,
      },
    });
  };

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  tag.onerror = () => { clearTimeout(watchdog); showFallback(); };
  document.head.appendChild(tag);
})();