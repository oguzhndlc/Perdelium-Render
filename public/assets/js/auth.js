document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  /* =========================
     LOGIN
  ========================= */
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();

      const identifier = document.getElementById("loginIdentifier").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      try {
        const res = await fetch("/api/users/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Giriş başarısız");
          return;
        }

        localStorage.setItem("access_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/index.html";

      } catch (err) {
        console.error("Login hatası:", err);
        alert("Sunucuya bağlanılamadı");
      }
    });
  }

  /* =========================
     REGISTER
  ========================= */
  if (registerForm) {

    const passwordInput = document.getElementById("registerPassword");

    const rules = {
      length: document.getElementById("rule-length"),
      upper: document.getElementById("rule-upper"),
      lower: document.getElementById("rule-lower"),
      number: document.getElementById("rule-number"),
      special: document.getElementById("rule-special")
    };

    // 🔐 Canlı kriter kontrolü
    passwordInput.addEventListener("input", () => {
      const value = passwordInput.value;

      toggleRule(rules.length, value.length >= 8);
      toggleRule(rules.upper, /[A-Z]/.test(value));
      toggleRule(rules.lower, /[a-z]/.test(value));
      toggleRule(rules.number, /\d/.test(value));
      toggleRule(rules.special, /[^A-Za-z0-9]/.test(value));
    });

    function toggleRule(element, condition) {
      if (condition) {
        element.classList.add("valid");
      } else {
        element.classList.remove("valid");
      }
    }

    registerForm.addEventListener("submit", async e => {
      e.preventDefault();

      const name = document.getElementById("registerName").value.trim();
      const surname = document.getElementById("registerSurname").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const username = document.getElementById("registerUsername").value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword =
        document.getElementById("registerPassword2").value.trim();

      if (!name || !surname || !email || !username || !password) {
        alert("Tüm alanları doldurun");
        return;
      }

      if (password !== confirmPassword) {
        alert("Şifreler uyuşmuyor");
        return;
      }

      const isPasswordStrong = Object.values(rules).every(rule =>
        rule.classList.contains("valid")
      );

      if (!isPasswordStrong) {
        alert("Şifre kriterlerinin tamamı sağlanmalıdır");
        return;
      }

      try {
        const response = await fetch("/api/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            surname,
            email,
            username,
            password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Kayıt başarısız");
          return;
        }

        console.log("Kayıt başarılı:", data);
        window.location.href = "/index.html";

      } catch (error) {
        console.error("Register hatası:", error);
        alert("Sunucuya bağlanılamadı");
      }
    });
  }
});
