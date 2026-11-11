const PER_PAGE = 5;
const params = new URLSearchParams(location.search);
const selectedId = Number(params.get("id") || 0);
const sorted = CINE.events.slice().sort((a, b) => b.id - a.id);
const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
let page = Number(params.get("page") || 1);
if (!params.get("page") && selectedId) {
  const index = sorted.findIndex((item) => item.id === selectedId);
  if (index >= 0) page = Math.floor(index / PER_PAGE) + 1;
}
page = Math.min(pages, Math.max(1, page || 1));

function article(item) {
  if (!item) return "";
  const movie = item.movieId ? CINE.movie(item.movieId) : null;
  const action = movie
    ? `<a class="primary" href="bookings.html?movie=${movie.id}">Book ${esc(movie.title)}</a>`
    : "";
  return `
    <article class="event-article">
      <p class="eyebrow">${esc(item.date)} · ${esc(item.author)}</p>
      <h3>${esc(item.title)}</h3>
      <img src="${item.image}" alt="">
      <p>${esc(item.body)}</p>
      <div class="actions">${action}</div>
    </article>`;
}

function row(item) {
  const open = item.id === selectedId ? " is-open" : "";
  return `
    <a class="b_content${open}" href="events.html?id=${item.id}&page=${page}">
      <div class="id">${item.id}</div>
      <div class="title">${esc(item.title)}</div>
      <div class="author">${esc(item.author)}</div>
      <div class="date">${esc(item.date)}</div>
    </a>`;
}

function pager() {
  const link = (label, target, disabled) => {
    if (disabled) return `<span>${label}</span>`;
    const idQuery = selectedId ? `&id=${selectedId}` : "";
    return `<a href="events.html?page=${target}${idQuery}">${label}</a>`;
  };
  let numbers = "";
  for (let i = 1; i <= pages; i += 1) {
    numbers += i === page ? `<span class="is-current">${i}</span>` : link(String(i), i, false);
  }
  return `
    <div class="b_page">
      ${link("&lt;&lt;", 1, page === 1)}
      ${link("&lt;", page - 1, page === 1)}
      ${numbers}
      ${link("&gt;", page + 1, page === pages)}
      ${link("&gt;&gt;", pages, page === pages)}
    </div>`;
}

const slice = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
const selected = CINE.event(selectedId);

document.getElementById("event-app").innerHTML = `
  ${article(selected)}
  <div class="board">
    <div class="b_top">
      <div class="id">Id.</div>
      <div class="title">Title</div>
      <div class="author">Author</div>
      <div class="date">Date</div>
    </div>
    ${slice.map(row).join("")}
  </div>
  ${pager()}`;
