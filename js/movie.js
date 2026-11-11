const params = new URLSearchParams(location.search);
const movie = CINE.movie(params.get("id"));
const root = document.getElementById("movie-root");

if (!movie) {
  root.innerHTML = `<p class="msg">That title is not on the chart. <a href="index.html#chart">Back to movies</a></p>`;
} else {
  document.title = `${movie.title} | CINEWORLD`;
  const soon = CINE.charts.soon.includes(movie.id);
  const trailer = movie.trailer
    ? `<div class="detail-video"><iframe src="https://www.youtube.com/embed/${movie.trailer}" title="${esc(movie.title)} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    : "";
  root.innerHTML = `
    <div class="detail">
      <div class="poster">
        <img src="${movie.poster}" alt="${esc(movie.title)}">
        <div class="age age-${movie.age}">${movie.age}</div>
      </div>
      <div>
        <p class="eyebrow">${soon ? "Coming soon · advance tickets open" : "Now on the chart"}</p>
        <h2>${esc(movie.title)}</h2>
        <p class="facts">
          <span>${esc(movie.genre)}</span>
          <span>${CINE.runtimeLabel(movie.runtime)}</span>
          <span>Age ${movie.age}</span>
          <span>${esc(movie.release)}</span>
        </p>
        <p>${esc(movie.synopsis)}</p>
        <p class="facts"><span>Director ${esc(movie.director)}</span></p>
        <p class="cast">${esc(movie.cast)}</p>
        <p class="fine">${CINE.money(CINE.price)} a seat at ${CINE.theaters.map((item) => esc(item.name)).join(", ")}.</p>
        <div class="actions">
          <a class="primary" href="bookings.html?movie=${movie.id}">Book seats</a>
          <a class="ghost" href="index.html#chart">All movies</a>
        </div>
      </div>
    </div>
    ${trailer}`;
}
