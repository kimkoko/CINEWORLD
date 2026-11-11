const root = document.getElementById("ticket-root");
const user = Store.session();

function when(booking) {
  return new Date(`${booking.date}T${booking.time}:00`).getTime();
}

function card(booking) {
  const movie = CINE.movie(booking.movieId);
  const theater = CINE.theater(booking.theaterId);
  const past = when(booking) <= Date.now();
  const status = booking.cancelled ? "Cancelled" : past ? "Screened" : "Upcoming";
  const cancel = !booking.cancelled && !past
    ? `<button type="button" class="ghost" data-cancel="${esc(booking.id)}">Cancel</button>`
    : "";
  return `
    <article class="ticket ${booking.cancelled ? "is-cancelled" : ""}">
      <img src="${movie.poster}" alt="">
      <div>
        <p class="eyebrow">${status} · ${esc(booking.id)}</p>
        <h3>${esc(movie.title)}</h3>
        <p>${esc(theater.name)} · Screen ${booking.screen}</p>
        <p>${esc(CINE.formatDate(booking.date))} · ${esc(booking.time)}</p>
        <p>Seats ${esc(booking.seats.join(", "))}</p>
      </div>
      <div class="ticket-side">
        <b>${CINE.money(booking.total)}</b>
        ${cancel}
      </div>
    </article>`;
}

function paint(message, ok) {
  if (!user) {
    root.innerHTML = `
      <p class="msg">Log in to see tickets saved in this browser.</p>
      <div class="actions"><a class="primary" href="login.html?next=tickets.html">Login</a></div>`;
    return;
  }
  const bookings = Store.mine();
  const note = message ? `<p class="msg${ok ? " ok" : ""}">${esc(message)}</p>` : "";
  if (!bookings.length) {
    root.innerHTML = `
      ${note}
      <p class="empty-copy">No tickets yet. A booking you confirm shows up here.</p>
      <div class="actions"><a class="primary" href="bookings.html">Book a movie</a></div>`;
    return;
  }
  root.innerHTML = note + bookings.map(card).join("");
}

root.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cancel]");
  if (!button) return;
  const id = button.getAttribute("data-cancel");
  if (!window.confirm(`Cancel ticket ${id}? The seats go back on sale.`)) return;
  const result = Store.cancel(id);
  paint(result.ok ? `${id} is cancelled.` : result.error, result.ok);
});

paint("");
