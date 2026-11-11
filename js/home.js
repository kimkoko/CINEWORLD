function posterCard(item, extra) {
  const soon = extra === "soon" ? '<span class="ribbon">SOON</span>' : "";
  return `
    <div>
      <a class="poster" href="movie.html?id=${item.id}">
        <img src="${item.poster}" alt="${esc(item.title)}">
        <div class="rank">${item.rank}</div>
        <div class="age age-${item.age}" title="Rated ${item.age}">${item.age}</div>
        ${soon}
      </a>
      <div class="info">
        <h3><a href="movie.html?id=${item.id}">${esc(item.title)}</a></h3>
        <a href="bookings.html?movie=${item.id}">Booking</a>
      </div>
    </div>`;
}

function renderCharts() {
  const mounts = { now: "contentF", soon: "contentS", recent: "contentT" };
  Object.keys(mounts).forEach((name) => {
    const mount = document.getElementById(mounts[name]);
    if (!mount) return;
    mount.innerHTML = CINE.chart(name).map((item) => posterCard(item, name === "soon" ? "soon" : "")).join("");
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll(".movieTitle .tap");
  const panels = {
    contentF: document.getElementById("contentF"),
    contentS: document.getElementById("contentS"),
    contentT: document.getElementById("contentT")
  };
  panels.contentS.style.display = "none";
  panels.contentT.style.display = "none";

  tabs.forEach((tab) => {
    tab.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault();
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      const selected = tab.getAttribute("data-tab");
      Object.keys(panels).forEach((id) => {
        panels[id].style.display = id === selected ? "grid" : "none";
      });
    });
  });
}

function setupTrailers() {
  const withTrailer = CINE.movies.filter((item) => item.trailer);
  let current = "minari";
  const main = document.getElementById("main-trailer");
  const label = document.getElementById("trailer-label");
  const side = document.getElementById("trailer-side");
  if (!main || !side) return;

  function paint() {
    const movie = CINE.movie(current);
    main.src = `https://www.youtube.com/embed/${movie.trailer}`;
    main.title = `${movie.title} trailer`;
    label.textContent = movie.title;
    side.innerHTML = withTrailer
      .filter((item) => item.id !== current)
      .map((item) => `
        <div class="mini-trailer" data-id="${item.id}" role="button" tabindex="0">
          <iframe src="https://www.youtube.com/embed/${item.trailer}" title="${esc(item.title)} trailer" tabindex="-1"></iframe>
          <span>${esc(item.title)}</span>
        </div>`)
      .join("");
  }

  function choose(event) {
    const card = event.target.closest(".mini-trailer");
    if (!card) return;
    current = card.getAttribute("data-id");
    paint();
  }

  side.addEventListener("click", choose);
  side.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    choose(event);
  });
  paint();
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.Swiper) {
    new Swiper(".swiper-container", {
      pagination: { el: ".swiper-pagination", type: "bullets" },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      autoplay: { delay: 3000 }
    });
  }
  renderCharts();
  setupTabs();
  setupTrailers();
});
