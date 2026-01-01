const loader = document.getElementById("pageLoader");
const content = document.getElementById("pageContent");

const token = localStorage.getItem("access_token");
if (!token) location.href = "/pages/login.html";

fetch("/api/contents/all", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {

  const eserler = data.contents || [];

  console.log("Eserler:", eserler);

  const liste = document.getElementById("eserListesi");

  const searchInput = document.getElementById("searchInput");
  const oyunTuruFilter = document.getElementById("oyunTuruFilter");
  const temaFilter = document.getElementById("temaFilter");
  const sureFilter = document.getElementById("sureFilter");
  const yasGrubuFilter = document.getElementById("yasGrubuFilter");
  const oyuncuSayisiFilter = document.getElementById("oyuncuSayisiFilter");
  const erkekFilter = document.getElementById("erkekOyuncuFilter");
  const kadinFilter = document.getElementById("kadinOyuncuFilter");



  function renderEserler(list) {
    liste.innerHTML = "";

    if (!list.length) {
      liste.innerHTML = `
        <div class="col-12 text-center text-light">
          Eşleşen eser bulunamadı
        </div>`;
      return;
    }

    list.forEach(eser => {
      liste.innerHTML += `
        <div class="col-md-4">
          <div class="play-card">
            <div class="play-info">
              <h5>${eser.title}</h5>
              <p>${eser.explanation ?? ""}</p>
              <button
                class="btn btn-sm btn-outline-light"
                onclick="contentDetailRedirect(${eser.id})">
                Detay
              </button>
            </div>
          </div>
        </div>
      `;
    });

loader.style.display = "none";
content.style.display = "block";
  }

function filtrele() {
  const arama = searchInput.value.toLowerCase();
  const tur = oyunTuruFilter.value;
  const tema = temaFilter.value;
  const sure = sureFilter.value;
  const yas = yasGrubuFilter.value;

  const oyuncuSayisi = parseInt(oyuncuSayisiFilter.value);
  const erkek = parseInt(erkekFilter.value);
  const kadin = parseInt(kadinFilter.value);

  const sonuc = eserler.filter(eser => {

    const tag = eser.content_tags?.[0]; // ✅ EN KRİTİK SATIR

    // 🔎 Arama
    const aramaEslesme =
      !arama ||
      eser.title?.toLowerCase().includes(arama) ||
      eser.users?.username?.toLowerCase().includes(arama);

    // 🎭 Tür
    const turEslesme = !tur || tag?.type === tur;

    // 🎨 Tema
    const temaEslesme = !tema || tag?.theme === tema;

    // ⏱ Süre
    const sureEslesme = !sure || tag?.time === sure;

    // 🔞 Yaş
    const yasEslesme = !yas || tag?.age_limit === yas;

    // 👥 Oyuncu sayısı
    const oyuncuEslesme =
      isNaN(oyuncuSayisi) || tag?.cast_count === oyuncuSayisi;

    // ♂️ Erkek
    const erkekEslesme =
      isNaN(erkek) || tag?.male_cast_count === erkek;

    // ♀️ Kadın
    const kadinEslesme =
      isNaN(kadin) || tag?.female_cast_count === kadin;

    return (
      aramaEslesme &&
      turEslesme &&
      temaEslesme &&
      sureEslesme &&
      yasEslesme &&
      oyuncuEslesme &&
      erkekEslesme &&
      kadinEslesme
    );
  });

  renderEserler(sonuc);
}


  // 🔁 TÜM input’ları dinamik yap
  [
    searchInput,
    oyunTuruFilter,
    temaFilter,
    sureFilter,
    yasGrubuFilter,
    oyuncuSayisiFilter,
    erkekFilter,
    kadinFilter
  ].forEach(el => {
    el.addEventListener("input", filtrele);
    el.addEventListener("change", filtrele);
  });

  renderEserler(eserler);
})
.catch(err => {
  console.error("İçerikler alınamadı:", err);
});

  const oyuncuSayisiFilter = document.getElementById("oyuncuSayisiFilter");
  const erkekFilter = document.getElementById("erkekOyuncuFilter");
  const kadinFilter = document.getElementById("kadinOyuncuFilter");

function guncelleCinsiyet(kaynak) {
    const toplam = parseInt(oyuncuSayisiFilter.value);
    if (isNaN(toplam) || toplam < 1) return;

    let erkek = parseInt(erkekFilter.value) || 0;
    let kadin = parseInt(kadinFilter.value) || 0;
    if (kaynak === "erkek") {
      if (erkek > toplam) erkek = toplam;
      kadin = toplam - erkek;
    }

    if (kaynak === "kadin") {
      if (kadin > toplam) kadin = toplam;
      erkek = toplam - kadin;
    }

    erkekFilter.value = erkek;
    kadinFilter.value = kadin;
  }

  erkekFilter.addEventListener("input", () => guncelleCinsiyet("erkek"));
  kadinFilter.addEventListener("input", () => guncelleCinsiyet("kadin"));

  oyuncuSayisiFilter.addEventListener("input", () => {
    const toplam = parseInt(oyuncuSayisiFilter.value);
    if (isNaN(toplam) || toplam < 1) return;

    const erkek = parseInt(erkekFilter.value) || 0;
    if (erkek > toplam) {
      erkekFilter.value = toplam;
      kadinFilter.value = 0;
    } else {
      kadinFilter.value = toplam - erkek;
    }
  });