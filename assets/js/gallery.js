const stage = document.getElementById("stage");
let cards = [];
let index = 0;
let autoplayTimer;

fetch("semua-berita.html")
  .then(res => res.text())
  .then(html => {
    const doc = new DOMParser().parseFromString(html, "text/html");

    // 🔒 AMAN: hanya ambil gambar artikel
    const images = doc.querySelectorAll("article img");

    images.forEach(img => {
  const link = img.closest("a"); // ambil <a> pembungkus gambar
  const href = link ? link.getAttribute("href") : "#";

  const card = document.createElement("a");
  card.href = href;
  card.className = "gallery-card gallery-off";
  card.setAttribute("aria-label", "Buka berita");

  card.innerHTML = `
    <img src="${img.getAttribute("src")}" alt="">
  `;

  stage.appendChild(card);
  cards.push(card);
});


    if(cards.length < 5){
      stage.innerHTML = "<p class='text-center'>Minimal 5 foto dibutuhkan.</p>";
      return;
    }

    render();
    startAutoplay();
  });

function mod(n,m){ return ((n%m)+m)%m; }

function render(){
  cards.forEach(c => c.className = "gallery-card gallery-off");

  cards[mod(index-2,cards.length)].className = "gallery-card gallery-left-2";
  cards[mod(index-1,cards.length)].className = "gallery-card gallery-left-1";
  cards[mod(index,cards.length)].className   = "gallery-card gallery-center";
  cards[mod(index+1,cards.length)].className = "gallery-card gallery-right-1";
  cards[mod(index+2,cards.length)].className = "gallery-card gallery-right-2";
}

function next(){
  index = mod(index+1, cards.length);
  render();
}

function prev(){
  index = mod(index-1, cards.length);
  render();
}

function startAutoplay(){
  autoplayTimer = setInterval(next, 5000);
}
function stopAutoplay(){
  clearInterval(autoplayTimer);
}

document.getElementById("next").onclick = ()=>{
  stopAutoplay(); next();
};
document.getElementById("prev").onclick = ()=>{
  stopAutoplay(); prev();
};
