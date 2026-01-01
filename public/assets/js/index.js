const loader = document.getElementById("pageLoader");
const content = document.getElementById("pageContent");

fetch("/api/contents/suggestions", {
  method: "GET",
  headers: {
  }
})
.then(response => response.json())
.then(data => {
  console.log("Rastgele içerikler:", data.contents);

  const scriptCardsContainer = document.getElementById("scriptCards");
  scriptCardsContainer.innerHTML = "";

  data.contents.forEach(eser => {
    scriptCardsContainer.innerHTML += `
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
