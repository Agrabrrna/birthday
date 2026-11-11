// YouTube IFrame Player — musik tidak pernah reload karena berada di luar section.
(() => {
  let player = null;
  let ready = false;
  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const fallback = document.getElementById("music-fallback");

  document.getElementById("music-title").textContent = CONFIG.music.title;
  fallback.href = CONFIG.music.fallbackUrl;

  function showFallback() {
    btnPlay.hidden = true;
    btnPause.hidden = true;
    fallback.hidden = false;
    const frame = document.querySelector(".music-frame");
    if (frame) frame.hidden = true;
  }

  // Jika API tidak siap dalam 8 detik (koneksi buruk / diblokir), tampilkan cadangan.
  const watchdog = setTimeout(() => { if (!ready) showFallback(); }, 8000);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("yt-player", {
      videoId: CONFIG.music.videoId,
      width: 220,
      height: 124,
      playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1, modestbranding: 1 },
      events: {
        onReady: () => {
          ready = true;
          clearTimeout(watchdog);
          btnPlay.addEventListener("click", () => player.playVideo());
          btnPause.addEventListener("click", () => player.pauseVideo());
        },
        onStateChange: (e) => {
          const playing = e.data === YT.PlayerState.PLAYING;
          btnPlay.hidden = playing;
          btnPause.hidden = !playing;
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