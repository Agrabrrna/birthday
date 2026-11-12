// SEMUA konten personal ada di file ini. Ganti teks dan foto di sini saja.
// Foto: letakkan file di assets/images/memories/ lalu sesuaikan "src" dan "alt".
const CONFIG = {
  recipientName: "Novi Yanti",
  senderName: "dd",

  welcome: {
    title: "Somewhere Under The Same Sky",
    subtitle: "A little story, made for someone special.",
    startButton: "Start the Journey",
  },

  birthday: {
    greeting: "Selamat ulang tahun, Kak Nop.",
    lines: [
      "Hari ini langit terasa sedikit lebih terang,",
      "Karena dunia sedang merayakan seseorang yang baik hati.",
      "Hope you’re happy with my gift, walau yang enggak seberapa ini.",
    ],
  },

  // Ganti src dengan foto asli, mis. "assets/images/memories/foto-1.webp".
  // Jika src null, ditampilkan placeholder bernomor sampai foto diisi.
  memories: [
    { src: "assets/images/memories/fotokucing.jpg", caption: "Kak nop dengan kucing lugunya", alt: "Foto kenangan 1" },
    { src: "assets/images/memories/foto2.jpg", caption: "Hari-hari di CNB mulu", alt: "Foto kenangan 2" },
    { src: "assets/images/memories/foto3.jpg", caption: "Kirim pap pertama di titkok, sangat menggemaskan", alt: "Foto kenangan 3" },
    { src: "assets/images/memories/foto4.jpg", caption: "Ini katanya makeupnya lagi oke banget dan aku setuju", alt: "Foto kenangan 4" },
    { src: "assets/images/memories/firstmeet.jpg", caption: "First meet dengan kak novi, ahayy", alt: "Foto kenangan 5" },
    { src: "assets/images/memories/kaknoi.jpg", caption: "Aku menyebutnya dengan kak noi, karena dilarang \"P\"", alt: "Foto kenangan 6" },
  ],

  letter: [
    "Sudah 24 tahun ya kak novi? Pasti ada banyak hal yang sudah kak nop lewati sampai akhirnya bisa berada di titik ini. Ku cuma mau berharap semoga di usia yang baru nanti, hidup kak novi bisa lebih ramah sama kakak yaa.",
    "Semoga hal-hal yang selama ini kak novi usahakan bisa menemukan hasil terbaiknya. Semoga selalu dikelilingi orang-orang yang tulus, dipertemukan dengan banyak kebahagiaan kecil, dan enggak pernah kehilangan alasan untuk tersenyum (cause i like your smile).",
    "Kalau suatu hari semuanya terasa berat, semoga kak novi ingat kalau kak nop enggak harus selalu baik-baik saja. Tidak apa-apa untuk istirahat, bingung, atau bahkan merasa tertinggal. Kak novi punya waktu sendiri, jadi jangan terlalu sering membandingkan perjalanan kak nop dengan orang lain.",
    "Terima kasih sudah menjadi bagian dari cerita dan hari-hari yang ada. Aku harap di usia 24 ini, kakak bisa lebih banyak menemukan hal yang membuat kak novi bahagia, lebih sedikit memikirkan hal yang menyakitkan, dan semakin menyayangi diri sendiri.",
    "Terima kasih sudah menjadi sosok yang baik, yang tanpa sadar bisa memberikan banyak pelajaran dan rasa nyaman. Mungkin aku enggak selalu mengatakannya tetapi aku bersyukur bisa mengenal seseorang seperti kak novi. Rasanya menyenangkan punya seseorang yang bisa dianggap seperti kakak sendiri.",
    "Pokoknya, semoga dunia memperlakukan kak nop dengan baik. You deserve so many good things. Happy 24th birthday in advance!",
  ],

  gifts: [
    {
      title: "Kado Pertama",
      icon: "sky",
      // Buket bunga dari foto (assets/images/ui/bouquet.jpg).
      flowerPhoto: "assets/images/ui/bouquet.jpg",
      message: "Ini kado pertama aku kasih bunga ya, walau cuman tampilan doang, ehe. Kalau bunga saja punya banyak warna, semoga hidup kak novi juga dipenuhi banyak alasan untuk bahagia. Jangan pernah berhenti berharap, ya.",
    },
    {
      title: "Kado Kedua",
      icon: "sea",
      message: "Seperti laut yang kadang tenang dan kadang punya ombak besar, hidup juga terasa seperti itu. Kalau suatu saat semuanya terasa melelahkan, jangan lupa untuk istirahat. Kak novi enggak harus selalu kuat setiap waktu. Take your time, everything has its own pace.",
    },
    {
      title: "Kado Kecil",
      icon: "small",
      // Ganti photo dengan foto kejutan, mis. "assets/images/memories/kejutan.webp"
      photo: "assets/images/memories/fotokecil2.jpg",
      message: "Mungkin kak novi enggak sadar, tetapi kehadiran kak novi bisa memberikan kesan baik untuk orang-orang di sekitar termasuk aku. Terima kasih sudah menjadi orang yang menyenangkan untuk dikenal. I’m genuinely glad that our paths crossed.",
    },
    {
      title: "Kado Terakhir",
      icon: "last",
      message: "Kalau boleh berharap, semoga di usia 24 tahun ini kak novi tidak hanya tumbuh menjadi seseorang yang hebat, tetapi juga seseorang yang lebih bahagia. Terima kasih sudah menjadi sosok kakak yang baik. Semoga suatu saat nanti, ketika melihat kembali perjalanan hidup, kak nop bangga dengan diri sendiri. You deserved all the good things in life.",
    },
  ],

  // Hadiah rahasia: tampilan chat WhatsApp dari "Kimi Antonelli".
  // Ganti photo dengan foto profil asli bila ada (mis. "assets/images/ui/kimi.webp").
  secretGift: {
    contactName: "Kimi Antonelli",
    photo: "assets/images/ui/kimi.jpg",
    messages: [
      "Ciao Novi! 🎂",
      "Happy 24th birthday, Novi Yanti! 🥳",
      "Semoga tahun ini penuh kebahagiaan, seperti lap tercepat di hari Minggu. 🏎️💨",
      "Keep smiling and keep chasing your dreams. Forza! 💙",
    ],
  },

  ending: [
    "And finally, here we are, at the end of this little journey.",
    "Kak novi, mungkin halaman ini sederhana dan ga seberapa dibandingkan dengan banyak hal lain yang pantas kak novi dapatkan. Tapi aku berharap, setidaknya ada sedikit senyum yang muncul ketika kak novi membacanya.",
    "Kalau suatu hari nanti kita sibuk dengan jalan masing-masing, aku berharap semoga kita tetap menjadi bagian kecil dari cerita baik yang pernah kita temui dalam hidup.",
    "So, here’s to 24. More laughter, more beautiful memories, more unexpected happiness, and more reasons to be proud of yourself.",
    "Somewhere under the same sky, I hope life is always kind to you.",
    "Happy 24th birthday, Kak Novi.",
    "With lots of warmth, from someone who’s grateful to know you",
  ],
  endingSignature: "-dd",
  endingQuote: "Somewhere under the same sky.",

  music: {
    // Video dari brief: https://youtu.be/kiTSuy6kwAc ("Coming Up Roses" loop).
    // Sudah diuji bisa di-embed dan berputar di Chrome asli.
    videoId: "kiTSuy6kwAc",
    title: "Coming Up Roses · Harry Styles",
    fallbackUrl: "https://youtu.be/kiTSuy6kwAc",
  },
};