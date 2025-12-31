const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "/pages/login.html";
}

const profile = user.user_profiles || {};
// Görüntüleme alanı
document.getElementById("profileName").textContent = user.name;
document.getElementById("profileAbout").textContent = profile.about || "Henüz bir biyografi eklenmemiş.";
document.getElementById("profileAvatar").src = profile.avatar_url || '/assets/images/default-avatar.png';


// Formu doldur
document.getElementById("editName").value = user.name;
document.getElementById("editSurname").value = user.surname;
document.getElementById("editUsername").value = user.username;
document.getElementById("editEmail").value = user.email;
document.getElementById("editPhone").value = profile.phone || "";
document.getElementById("editWebsite").value = profile.web_link || "";
document.getElementById("editInstagram").value = profile.insta_link || "";
document.getElementById("editAbout").value = profile.about || "";

// Düzenleme butonları

const editBtn = document.getElementById("editProfileBtn");
const editCard = document.getElementById("profileEditCard");
const cancelBtn = document.getElementById("cancelEditBtn");

// Aç
editBtn.addEventListener("click", () => {
  editCard.classList.remove("d-none");
  editBtn.classList.add("d-none");
});

// Kapat
cancelBtn.addEventListener("click", () => {
  editCard.classList.add("d-none");
  editBtn.classList.remove("d-none");
});

// Kaydet
document.getElementById("profileEditForm").addEventListener("submit", async e => {
  e.preventDefault();

  const res = await fetch("/api/users/updateProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      phone: document.getElementById("editPhone").value,
      about: document.getElementById("editAbout").value,
      insta_link: document.getElementById("editInstagram").value,
      web_link: document.getElementById("editWebsite").value,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Hata: " + (data.error || "Profil güncellenemedi"));
    return;
  }

  // ✅ localStorage güncelle
  const updatedUser = {
    ...user,
    name: document.getElementById("editName").value,
    surname: document.getElementById("editSurname").value,
    username: document.getElementById("editUsername").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    user_profiles: {
      ...user.user_profiles,
      phone: document.getElementById("editPhone").value,
      web_link: document.getElementById("editWebsite").value,
      insta_link: document.getElementById("editInstagram").value,
      about: document.getElementById("editAbout").value,
    },
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));

  alert("Profil güncellendi ✅");
  location.reload();
});