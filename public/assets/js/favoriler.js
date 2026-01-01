document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("access_token");
  if (!token) {
    location.href = "/pages/login.html";
    return;
  }

  const loader = document.getElementById("pageLoader");
  const content = document.getElementById("pageContent");
  const list = document.getElementById("favorilerList");
  const emptyState = document.getElementById("emptyState");

  // 🔄 Loader göster
  loader.style.display = "flex";
  content.style.display = "none";

  // 📡 Favori eserleri getir
  fetch("/api/favorites", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Favoriler alınamadı");
      return res.json();
    })
    .then(data => {

      const favoriler = data.favorites || [];

      list.innerHTML = "";

      // ⛔ Favori yoksa
      if (!favoriler.length) {
        emptyState.classList.remove("d-none");
      } else {
        emptyState.classList.add("d-none");

        favoriler.forEach(eser => {
          list.innerHTML += `
            <div class="col-md-4">
              <div class="play-card">
                <div class="play-info">
                  <h5>${eser.title}</h5>
                  <p>${eser.explanation ?? ""}</p>

                  <div class="d-flex justify-content-between mt-2">
                    <button
                      class="btn btn-sm btn-outline-light"
                      onclick="goToEser(${eser.id})">
                      Detay
                    </button>

                    <button
                      class="btn btn-sm btn-outline-danger"
                      onclick="removeFavorite(${eser.id})">
                      ✖
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }

    })
    .catch(err => {
      console.error("Favoriler yüklenemedi:", err);
      alert("Favoriler yüklenirken hata oluştu");
    })
    .finally(() => {
      // ✅ Loader kapat
      loader.style.display = "none";
      content.style.display = "block";
    });
});

/* =========================
   YARDIMCI FONKSİYONLAR
========================= */

// 🔗 Detaya git
function goToEser(id) {
  location.href = `/pages/eser-detay.html?id=${id}`;
}

// ❌ Favoriden çıkar
function removeFavorite(eserId) {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  if (!confirm("Bu eseri favorilerden kaldırmak istiyor musunuz?")) return;

  fetch(`/api/favorites/${eserId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Silme başarısız");
      // Sayfayı yenile
      location.reload();
    })
    .catch(err => {
      console.error("Favori silinemedi:", err);
      alert("Favoriden çıkarılırken hata oluştu");
    });
}
