const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "/pages/login.html";

document.getElementById("eserForm").addEventListener("submit", e => {
  e.preventDefault();

  alert("Eser backend’e gönderilecek (hazır)");
  e.target.reset();
});
