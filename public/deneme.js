let id = 1;

/* ---------------- SAVE DATA ---------------- */
async function saveData(getid, getname) {
  const user = {
    id: getid,
    name: getname,
  };

  // 🍪 Cookie kaydet
  document.cookie =
    "user=" +
    encodeURIComponent(JSON.stringify(user)) +
    "; path=/;";

  const response = await fetch("/.netlify/functions/api/saveUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();
  console.log("API response:", data);
}

/* ---------------- COOKIE ---------------- */
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return value;
  }
  return null;
}

function getUserFromCookie() {
  const cookie = getCookie("user");
  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return null;
  }
}

function getcook() {
  const user = getUserFromCookie();
  if (!user) {
    console.log("Cookie yok");
    return;
  }
  console.log("Cookie user:", user);
}

/* ---------------- LOGIN ---------------- */
document.getElementById("LoginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

    const res = await fetch("/api/users/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const text = await res.text();
  const data = JSON.parse(text);

  console.log("RAW:", text);

  if (!res.ok) {
    alert("Giriş başarısız");
    return;
  }

  console.log("LOGIN OK:", data);
  localStorage.setItem("user", JSON.stringify(data.user));
  alert("Giriş başarılı! Hoşgeldin, " + data.user.name);
});
/*
function loginUser() {
  const user = getUserFromCookie();
  const name = document.getElementById("loginNameInput").value.trim();

  if (!user) {
    alert("Kayıtlı kullanıcı yok!");
    return;
  }

  if (name === user.name) {
    alert("Giriş Başarılı! Hoşgeldin, " + name);
  } else {
    alert("Giriş Başarısız!");
  }
}
*/


/* ---------------- USER FORM ---------------- 
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value.trim();
  if (!name) return;

  const tableBody = document.getElementById("userTableBody");

  const currentId = id++;

  tableBody.insertAdjacentHTML(
    "beforeend",
    `
    <tr>
      <td>${currentId}</td>
      <td>${name}</td>
    </tr>
    `
  );

  await saveData(currentId, name);

  nameInput.value = "";
});
*/
function supabasesaid(text){
  console.log("Supabase:", text);
}

/* ---------------- SUPABASE INSERT ---------------- */
async function SupaBasesend() {
  const nameInput = document.getElementById("sendname");
  const emailInput = document.getElementById("sendemail");
  const surnameInput = document.getElementById("sendsurname");
  const usernameInput = document.getElementById("sendusername");
  const passwordInput = document.getElementById("sendpassword");
  const confirmPasswordInput = document.getElementById("confirmpassword");
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const surname = surnameInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!name) {
    alert("Lütfen bir isim giriniz!"); // veya kendi uyarı fonksiyonun
    return;
  }
  if (!email) {
    alert("Lütfen bir email giriniz!");
    return;
  }
  if (!username) {
    alert("Lütfen bir kullanıcı adı giriniz!");
    return;
  }
  if (password==confirmPassword) {
  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, 
        email: email, 
        surname: surname, 
        username: username, 
        password: password}),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Başarıyla kaydedildi:", result);

      // Giriş alanlarını temizle
      nameInput.value = "";
      emailInput.value = "";

      // Listeyi güncellemek için diğer fonksiyonunu çağırabilirsin
      getsom(); 
    } else {
      const errorData = await response.json();
      console.error("Sunucu hatası:", errorData);
    }
  } catch (error) {
    console.error("İstek gönderilemedi:", error);
  }
} else {
  alert("Şifreler eşleşmiyor!");
}
}
async function getsom(){
  try {
    // BURASI DÜZELTİLDİ: const response = ... eklendi
    const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Önce hata var mı kontrol edelim
    if (!response.ok) {
        throw new Error(`HTTP hatası! Durum: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
  } catch (error) {
    console.error("Fetch hatası:", error);
  }
}

/* ---------------- FILE UPLOAD ---------------- */
async function upload() {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Lütfen dosya seç");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    const res = await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: base64,
        fileName: file.name,
        contentType: file.type,
      }),
    });

    const data = await res.json();
    console.log("Upload:", data);
  };

  reader.readAsDataURL(file);
}
