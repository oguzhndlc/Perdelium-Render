const user = JSON.parse(localStorage.getItem("user"));
if (!user) location.href = "/pages/login.html";

const eserler = [
  { ad: "Hamlet", yazar: "Shakespeare", tur: "Klasik" },
  { ad: "Keşanlı Ali", yazar: "Haldun Taner", tur: "Modern" }
];

const list = document.getElementById("eserlerimList");

eserler.forEach(eser => {
  list.innerHTML += `
    <div class="col-md-4">
      <div class="play-card">
        <div class="play-info">
          <h5>${eser.ad}</h5>
          <p>${eser.yazar}</p>
          <span class="badge bg-secondary">${eser.tur}</span>
        </div>
      </div>
    </div>
  `;
});
