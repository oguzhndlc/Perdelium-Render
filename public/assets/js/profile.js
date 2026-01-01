const loader = document.getElementById("pageLoader");
const content = document.getElementById("pageContent");

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
document.getElementById("editPhone").value = profile.phone
  ? formatPhone(profile.phone)
  : "";

document.getElementById("editWebsite").value = profile.web_link || "";
document.getElementById("editInstagram").value = profile.insta_link || "";
document.getElementById("editAbout").value = profile.about || "";


loader.style.display = "none";
content.style.display = "block";
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

  const cleanPhone = document
    .getElementById("editPhone")
    .value.replace(/\s/g, "");

  const res = await fetch("/api/users/updateProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      phone: cleanPhone,
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

const phoneInput = document.getElementById("editPhone");

function formatPhone(value) {
  // sadece rakamlar
  let digits = value.replace(/\D/g, "");

  // HER ZAMAN 5 ile başlasın
  if (!digits.startsWith("5")) {
    digits = "5" + digits.replace(/^5+/, "");
  }

  // max 10 rakam
  digits = digits.slice(0, 10);

  // 555 333 4477 formatı
  if (digits.length > 6) {
    return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3");
  } else if (digits.length > 3) {
    return digits.replace(/(\d{3})(\d+)/, "$1 $2");
  }
  return digits;
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = formatPhone(phoneInput.value);
});

phoneInput.addEventListener("focus", () => {
  if (phoneInput.value.trim() === "") {
    phoneInput.value = "5";
  }
});

function deleteAccount() {
  const confirmText = prompt(
    "Hesabını silmek için EVET yaz (geri alınamaz!)"
  );

  if (confirmText !== "EVET") {
    alert("Hesap silme iptal edildi");
    return;
  }

  const token = localStorage.getItem("access_token");

  fetch("/api/users/accdel", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(async res => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    return res.json();
  })
  .then(() => {
    alert("Hesabın silindi. Güle güle 😢");

    localStorage.clear();
    location.href = "/";
  })
  .catch(err => {
    console.error("Hesap silme hatası:", err.message);
    alert("Hesap silinemedi");
  });
}
