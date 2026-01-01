const loader = document.getElementById("pageLoader");
const content = document.getElementById("pageContent");

// 🔎 URL'den username al
const params = new URLSearchParams(window.location.search);
const username = params.get("username");

if (!username) {
  alert("Kullanıcı bulunamadı");
  location.href = "/";
}

// 📡 API çağrısı
fetch(`/api/users/username/${username}`)
  .then(res => res.json())
  .then(data => {

    if (!data.success) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const user = data.user;
    const eserler = data.contents || [];

    // 👤 PROFİL DOLDUR
    document.getElementById("profileUsername").textContent = user.username;
    document.getElementById("profileName").textContent =
      `${user.name ?? ""} ${user.surname ?? ""}`.trim();

    document.getElementById("profileAbout").textContent =
      user.user_profiles?.about || "Bu kullanıcı henüz bir biyografi eklememiş.";

    document.getElementById("profileAvatar").src =
      user.user_profiles?.avatar_url || "/assets/img/default-avatar.png";

    // 🎭 ESERLER
    const eserContainer = document.getElementById("kullaniciEserleri");
    eserContainer.innerHTML = "";

    if (!eserler.length) {
      eserContainer.innerHTML = `
        <div class="col-12 text-center text-light">
          Bu kullanıcı henüz eser paylaşmamış.
        </div>`;
    } else {
      eserler.forEach(eser => {
        eserContainer.innerHTML += `
          <div class="col-md-4">
            <div class="play-card">
              <div class="play-info">
                <h5>${eser.title}</h5>
                <p>${eser.explanation ?? ""}</p>
                <button class="btn btn-sm btn-outline-light"
                  onclick="contentDetailRedirect(${eser.id})">
                  Detay
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    // ✅ HER ŞEY TAMAM → SAYFAYI GÖSTER
    loader.style.display = "none";
    content.style.display = "block";
  })
  .catch(err => {
    console.error(err);
    loader.innerHTML = `
      <p>Profil yüklenirken hata oluştu</p>
      <button onclick="location.reload()">Tekrar Dene</button>
    `;
  });

// 🔗 Detay
function goToEser(id) {
  location.href = `/pages/eser-detay.html?id=${id}`;
}
