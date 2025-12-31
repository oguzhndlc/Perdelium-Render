const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "/pages/login.html";

document.getElementById("eserForm").addEventListener("submit", e => {
  e.preventDefault();

  const eserHtml = tinymce.get("editor").getContent();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  fetch("/api/contents/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: data.eserAd,
      explanation: data.eserAciklama,
      html_content: eserHtml,
      type: data.oyunTuru,
      theme: data.tema,
      time: data.sure,
      age_limit: data.yasGrubu,
      cast_count: parseInt(data.oyuncuSayisi),
      male_cast_count: parseInt(data.erkekOyuncu),
      female_cast_count: parseInt(data.kadinOyuncu)
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert("Eser başarıyla kaydedildi.");
    } else {
      alert("Eser kaydedilirken hata oluştu.");
    }
  });

  e.target.reset();
});

  const oyuncuSayisiInput = document.getElementById("oyuncuSayisi");
  const erkekInput = document.getElementById("erkekOyuncu");
  const kadinInput = document.getElementById("kadinOyuncu");

  function guncelleCinsiyet(kaynak) {
    const toplam = parseInt(oyuncuSayisiInput.value);
    if (isNaN(toplam) || toplam < 1) return;

    let erkek = parseInt(erkekInput.value) || 0;
    let kadin = parseInt(kadinInput.value) || 0;

    if (kaynak === "erkek") {
      if (erkek > toplam) erkek = toplam;
      kadin = toplam - erkek;
    }

    if (kaynak === "kadin") {
      if (kadin > toplam) kadin = toplam;
      erkek = toplam - kadin;
    }

    erkekInput.value = erkek;
    kadinInput.value = kadin;
  }

  erkekInput.addEventListener("input", () => guncelleCinsiyet("erkek"));
  kadinInput.addEventListener("input", () => guncelleCinsiyet("kadin"));

  oyuncuSayisiInput.addEventListener("input", () => {
    const toplam = parseInt(oyuncuSayisiInput.value);
    if (isNaN(toplam) || toplam < 1) return;

    const erkek = parseInt(erkekInput.value) || 0;
    if (erkek > toplam) {
      erkekInput.value = toplam;
      kadinInput.value = 0;
    } else {
      kadinInput.value = toplam - erkek;
    }
  });