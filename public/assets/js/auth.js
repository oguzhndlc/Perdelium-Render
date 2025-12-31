document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();

  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

    const res = await fetch("/api/users/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const text = await res.text();
  const data = JSON.parse(text);

  if (!res.ok) {
    alert("Giriş başarısız");
    return;
  }
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("user_profiles", JSON.stringify(data.user_profiles));
    window.location.href = "/index.html";
  });
}


  if (registerForm) {
    registerForm.addEventListener("submit", async e => {
      e.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const surname = document.getElementById("registerSurname").value.trim();
        const username = document.getElementById("registerUsername").value.trim();
        const password = document.getElementById("registerPassword").value.trim();
        const confirmPassword = document.getElementById("registerPassword2").value.trim();

          if (!name || !surname) {
            alert("İsim ve soyisim eksik girildi!");
            return;
          }
          if (!email) {
            alert("Email eksik girildi!");
            return;
          }
          if (!username) {
            alert("Kullanıcı adı eksik girildi!");
            return;
          }
          if (!password || !confirmPassword) {
            alert("Şifre alanları eksik girildi!");
            return;
          }

      if (password !== confirmPassword) {
        alert("Şifreler uyuşmuyor");
        return;
      }
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
    } else {
      const errorData = await response.json();
      console.error("Sunucu hatası:", errorData);
    }
  } catch (error) {
    console.error("İstek gönderilemedi:", error);
  }

    });
  }

});
