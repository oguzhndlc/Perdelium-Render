const eserler = [
  {
    id: 1,
    ad: "Hamlet",
    yazar: "William Shakespeare",
    tur: "klasik",
    afis: "/assets/images/ornek1.jpg"
  },
  {
    id: 2,
    ad: "Keşanlı Ali",
    yazar: "Haldun Taner",
    tur: "modern",
    afis: "/assets/images/ornek2.jpg"
  },
  {
    id: 3,
    ad: "Bir Delinin Hatıra Defteri",
    yazar: "Nikolay Gogol",
    tur: "komedi",
    afis: "/assets/images/ornek3.jpg"
  }
];

const liste = document.getElementById("eserListesi");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");

function renderEserler(data) {
  liste.innerHTML = "";

  data.forEach(eser => {
    liste.innerHTML += `
      <div class="col-md-4">
        <div class="play-card">
          <img src="${eser.afis}" alt="${eser.ad}">
          <div class="play-info">
            <h5>${eser.ad}</h5>
            <p>${eser.yazar}</p>
            <a href="/pages/eser-detay.html?id=${eser.id}" class="btn btn-sm btn-outline-light">
              Detay
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

function filtrele() {
  const arama = searchInput.value.toLowerCase();
  const tur = genreFilter.value;

  const sonuc = eserler.filter(eser => {
    const eslesme =
      eser.ad.toLowerCase().includes(arama) ||
      eser.yazar.toLowerCase().includes(arama);

    const turEslesme = tur === "" || eser.tur === tur;

    return eslesme && turEslesme;
  });

  renderEserler(sonuc);
}

searchInput.addEventListener("input", filtrele);
genreFilter.addEventListener("change", filtrele);

renderEserler(eserler);
