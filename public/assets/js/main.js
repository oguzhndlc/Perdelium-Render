document.addEventListener("DOMContentLoaded", () => {
  console.log("Frontend hazır 🎭");
});

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar");

  if (navbarContainer) {
    fetch("/components/navbar.html")
      .then(res => res.text())
      .then(html => {
        navbarContainer.innerHTML = html;
      })
      .catch(err => {
        console.error("Navbar yüklenemedi:", err);
      });
  }
});
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".tiyatro-navbar");
  if (!navbar) return;

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
function renderNavbarAuth() {
  const navAuthArea = document.getElementById("navAuthArea");
  if (!navAuthArea) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Giriş yapılmış
    navAuthArea.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
          ${user.name}
        </a>
        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
          <li><a class="dropdown-item" href="/pages/profile.html">Profil</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Çıkış Yap</a></li>
        </ul>
      </li>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("user_profiles");
      location.reload();
    });

  } else {
    // Giriş yok
    navAuthArea.innerHTML = `
          <a class="btn btn-outline-light btn-sm" href="/pages/login.html">Giriş</a>
    `;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar");

  if (navbarContainer) {
    fetch("/components/navbar.html")
      .then(res => res.text())
      .then(html => {
        navbarContainer.innerHTML = html;
        renderNavbarAuth(); // 🔥 kritik
      });
  }
});
