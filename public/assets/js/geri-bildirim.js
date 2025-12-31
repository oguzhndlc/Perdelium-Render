const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("feedbackForm").addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    user: user ? user.name : "Misafir",
    type: document.getElementById("feedbackType").value,
    message: document.getElementById("feedbackMessage").value,
    date: new Date().toISOString()
  };

  console.log("Geri Bildirim:", data);

  alert("Geri bildirimin için teşekkürler 🎭");
  e.target.reset();
});
