const loader = document.getElementById("pageLoader");
const content = document.getElementById("pageContent");
// URL'den id al
const params = new URLSearchParams(window.location.search);
const eserId = params.get("id");

if (!eserId) {
  console.error("Eser ID bulunamadı");
}

// 🔥 Detay verisini backend'den al
fetch(`/api/contents/${eserId}`)
  .then(res => res.json())
  .then(data => {
    const eser = data.content;

    if (!eser) {
      console.error("Eser bulunamadı");
      return;
    }

    const tag = eser.content_tags?.[0];

    document.getElementById("eserAd").textContent = eser.title;
    document.getElementById("eserYazar").textContent =
      eser.users?.username ?? "Bilinmeyen";

    document.getElementById("eserYazar").onclick = function() {
      profileRedirect(eser.users?.username);
    }

    document.getElementById("eserAciklama").textContent =
      eser.explanation ?? "";

    document.getElementById("eserTur").textContent =
      tag?.type ?? "-";
    document.getElementById("eserTema").textContent =
      tag?.theme ?? "-";
    document.getElementById("eserSure").textContent = 
      tag?.time ?? "-";
    document.getElementById("eserYasGrubu").textContent =
      tag?.age_limit ?? "-";
    document.getElementById("eserOyuncuSayisi").textContent ="Oyuncu Sayısı: " +
      tag?.cast_count ?? "-";
    document.getElementById("eserErkekOyuncu").textContent ="Erkek Oyuncu: " +
      tag?.male_cast_count ?? "-";
    document.getElementById("eserKadinOyuncu").textContent ="Kadın Oyuncu: " +
      tag?.female_cast_count ?? "-";

    document.getElementById("content-area").innerHTML =
      eser.html_content ?? "<p>İçerik bulunamadı.</p>";

    if (eser.cover_url) {
      document.getElementById("eserAfis").src = eser.cover_url;
    }

    loader.style.display = "none";
    content.style.display = "block";

    
  
      document.getElementById("addFavorites").onclick = function() {
      addToFavorites(eser.id);
    }


  async function addToFavorites(contentId) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Favorilere eklemek için giriş yapmalısınız");
    window.location.href = "/pages/login.html";
    return;
  }

  try {
    const res = await fetch("/api/contents/:contentId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        content_id: contentId
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Favorilere eklenemedi");
      return;
    }

    alert("Favorilere eklendi ❤️");

  } catch (err) {
    console.error("Favori ekleme hatası:", err);
    alert("Sunucu hatası");
  }
}


  })
  .catch(err => {
    console.error("Eser alınamadı:", err);
  });
