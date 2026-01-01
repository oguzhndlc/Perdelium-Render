const loader = document.getElementById("pageLoader");
const content = document.getElementById("pageContent");

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("access_token");

if (!user || !token) location.href = "/pages/login.html";

fetch("/api/contents/my", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  console.log("İçerikler:", data.contents);

  const list = document.getElementById("eserlerimList");
  list.innerHTML = ""; // temizlik

  data.contents.forEach(eser => {
    list.innerHTML += `
      <div class="col-md-4">
        <div class="play-card">
          <div class="play-info">
            <h5>${eser.title}</h5>
            <p>${eser.explanation ?? ""}</p>
            <button
              class="btn btn-sm btn-outline-light"
              onclick="contentDetailRedirect(${eser.id})">
              Detay
            </button>
            <button
              class="btn btn-sm btn-danger"
              onclick="delScript(${eser.id})">
              Eseri sil
            </button>
          </div>
        </div>
      </div>
    `;
  });
loader.style.display = "none";
content.style.display = "block";
})
.catch(err => {
  console.error("İçerikler alınamadı:", err);
});

function delScript(id) {
  if (!confirm("Bu içeriği silmek istediğine emin misin?")) return;

  const token = localStorage.getItem("access_token");

  fetch(`/api/contents/condel/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      alert(data.error || "Silme başarısız");
      return;
    }

    alert("İçerik silindi");
    location.reload(); // ya da listeden kaldır
  })
  .catch(err => {
    console.error("Silme hatası:", err);
    alert("Bir hata oluştu");
  });
}
