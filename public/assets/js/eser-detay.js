const eserler = [
  {
    id: 1,
    ad: "Hamlet",
    yazar: "William Shakespeare",
    tur: "Klasik",
    aciklama: "Danimarka Prensi Hamlet'in intikam hikâyesi.",
    afis: "/assets/images/ornek1.jpg"
  },
  {
    id: 2,
    ad: "Keşanlı Ali",
    yazar: "Haldun Taner",
    tur: "Modern",
    aciklama: "Toplumsal taşlama içeren epik müzikal.",
    afis: "/assets/images/ornek2.jpg"
  },
  {
    id: 3,
    ad: "Bir Delinin Hatıra Defteri",
    yazar: "Nikolay Gogol",
    tur: "Komedi",
    aciklama: "Bir memurun deliliğe sürüklenişi.",
    afis: "/assets/images/ornek3.jpg"
  }
];

// URL'den id al
const params = new URLSearchParams(window.location.search);
const eserId = parseInt(params.get("id"));

const eser = eserler.find(e => e.id === eserId);

if (eser) {
  document.getElementById("eserAd").textContent = eser.ad;
  document.getElementById("eserYazar").textContent = eser.yazar;
  document.getElementById("eserAciklama").textContent = eser.aciklama;
  document.getElementById("eserTur").textContent = eser.tur;
  document.getElementById("eserAfis").src = eser.afis;
}
