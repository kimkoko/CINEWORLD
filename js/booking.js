const DRAFT_KEY = "cw_draft";

const state = {
  step: "movie",
  movieId: "",
  theaterId: "",
  date: "",
  time: "",
  screen: 0,
  seats: [],
  notice: "",
  done: null
};

function showKey() {
  return CINE.showKey(state);
}

function occupiedSet() {
  return new Set(state.time ? Store.occupied(showKey()) : []);
}

function saveDraft() {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
    step: "seats",
    movieId: state.movieId,
    theaterId: state.theaterId,
    date: state.date,
    time: state.time,
    screen: state.screen,
    seats: state.seats
  }));
}

function restoreDraft() {
  const params = new URLSearchParams(location.search);
  if (params.get("resume") !== "1") return;
  const raw = sessionStorage.getItem(DRAFT_KEY);
  sessionStorage.removeItem(DRAFT_KEY);
  if (!raw) return;
  try {
    const draft = JSON.parse(raw);
    if (!CINE.movie(draft.movieId) || !CINE.theater(draft.theaterId)) return;
    state.movieId = draft.movieId;
    state.theaterId = draft.theaterId;
    state.date = draft.date;
    state.time = draft.time;
    state.screen = draft.screen;
    state.seats = draft.seats || [];
    const taken = occupiedSet();
    const lost = state.seats.filter((seat) => taken.has(seat));
    state.seats = state.seats.filter((seat) => !taken.has(seat));
    state.notice = lost.length ? `${lost.join(", ")} sold while you were logging in.` : "";
    state.step = "seats";
  } catch (error) {
    state.step = "movie";
  }
}

function go(step) {
  state.step = step;
  state.notice = "";
  if (step === "movie") {
    state.theaterId = "";
    state.date = "";
    state.time = "";
    state.seats = [];
  }
  if (step === "theater") {
    state.date = "";
    state.time = "";
    state.seats = [];
  }
  if (step === "show") {
    state.time = "";
    state.seats = [];
    if (!state.date) state.date = CINE.upcomingDates()[0].iso;
  }
  render();
}

function crumb() {
  const movie = CINE.movie(state.movieId);
  const theater = CINE.theater(state.theaterId);
  const bits = [];
  if (movie) bits.push(`<button type="button" data-go="movie">${esc(movie.title)}</button>`);
  if (theater && state.step !== "movie" && state.step !== "theater") {
    bits.push(`<button type="button" data-go="theater">${esc(theater.name)}</button>`);
  }
  if (state.date && (state.step === "seats" || state.step === "done")) {
    bits.push(`<button type="button" data-go="show">${esc(CINE.formatDate(state.date))} · ${esc(state.time)}</button>`);
  }
  return bits.length ? `<p class="crumb">${bits.join("<span> / </span>")}</p>` : "";
}

function noticeHtml() {
  return state.notice ? `<p class="msg">${esc(state.notice)}</p>` : "";
}

function renderMovie() {
  return `
    ${noticeHtml()}
    <h3>Choose a movie</h3>
    <div class="pick-grid">
      ${CINE.movies.map((item) => `
        <button type="button" class="pick-card ${item.id === state.movieId ? "is-selected" : ""}" data-movie="${item.id}">
          <img src="${item.poster}" alt="">
          <span class="pick-title">${esc(item.title)}</span>
          <span class="pick-meta">Age ${item.age} · ${esc(item.genre)}</span>
        </button>`).join("")}
    </div>`;
}

function renderTheater() {
  return `
    ${crumb()}
    <h3>Choose a branch</h3>
    <div class="choice-row">
      ${CINE.theaters.map((item) => `
        <button type="button" class="choice" data-theater="${item.id}">${esc(item.name)}</button>`).join("")}
    </div>`;
}

function renderShow() {
  const dates = CINE.upcomingDates();
  const times = CINE.shows(state.movieId, state.theaterId, state.date)
    .filter((show) => new Date(`${state.date}T${show.time}:00`).getTime() > Date.now());
  return `
    ${crumb()}
    ${noticeHtml()}
    <h3>Date</h3>
    <div class="choice-row">
      ${dates.map((day) => `
        <button type="button" class="choice ${day.iso === state.date ? "is-selected" : ""}" data-date="${day.iso}">${esc(day.label)}</button>`).join("")}
    </div>
    <h3>Showtime</h3>
    <div class="choice-row">
      ${times.length ? "" : '<p class="msg">No screenings left on this date.</p>'}
      ${times.map((show) => {
        const key = CINE.showKey({
          movieId: state.movieId,
          theaterId: state.theaterId,
          date: state.date,
          time: show.time,
          screen: show.screen
        });
        const left = CINE.rows.length * CINE.cols - Store.occupied(key).length;
        const disabled = left <= 0 ? "disabled" : "";
        return `
          <button type="button" class="choice show-choice" data-time="${show.time}" data-screen="${show.screen}" ${disabled}>
            <strong>${show.time}</strong>
            <span>Screen ${show.screen}</span>
            <span>${left} seats left</span>
          </button>`;
      }).join("")}
    </div>`;
}

function renderSeats() {
  const taken = occupiedSet();
  const selected = new Set(state.seats);
  let map = "";
  for (const row of CINE.rows) {
    let cells = `<span class="row-label">${row}</span>`;
    for (let col = 1; col <= CINE.cols; col += 1) {
      if (col === 5 || col === 9) cells += '<span class="aisle"></span>';
      const id = row + col;
      const isTaken = taken.has(id);
      const isOn = selected.has(id);
      const cls = isTaken ? "taken" : isOn ? "selected" : "";
      cells += `<button type="button" class="seat ${cls}" data-seat="${id}" ${isTaken ? "disabled" : ""} aria-pressed="${isOn}" aria-label="Seat ${id}${isTaken ? ", sold" : ""}"></button>`;
    }
    map += `<div class="seat-row">${cells}</div>`;
  }
  const count = state.seats.length;
  return `
    ${crumb()}
    ${noticeHtml()}
    <h3>Seats</h3>
    <p class="fine">Screen ${state.screen} · ${esc(state.time)} · ${CINE.money(CINE.price)} a seat · up to 8</p>
    <div class="auditorium">
      <div class="screen-glow"></div>
      <div class="screen-label">SCREEN</div>
      <div class="seat-map">${map}</div>
    </div>
    <div class="legend">
      <span><i class="seat"></i> Open</span>
      <span><i class="seat selected"></i> Yours</span>
      <span><i class="seat taken"></i> Sold</span>
    </div>
    <div class="summary">
      <div>
        <strong>${count ? CINE.sortSeats(state.seats).join(", ") : "No seats yet"}</strong>
        <span>${count} × ${CINE.money(CINE.price)}</span>
      </div>
      <div class="summary-actions">
        <b>${CINE.money(count * CINE.price)}</b>
        <button type="button" class="primary" id="confirm" ${count ? "" : "disabled"}>Confirm</button>
      </div>
    </div>`;
}

function renderDone() {
  const booking = state.done;
  const movie = CINE.movie(booking.movieId);
  const theater = CINE.theater(booking.theaterId);
  return `
    <div class="ticket-done">
      <p class="eyebrow">Booking complete</p>
      <h3>${esc(movie.title)}</h3>
      <p class="code">${esc(booking.id)}</p>
      <ul>
        <li>${esc(theater.name)} · Screen ${booking.screen}</li>
        <li>${esc(CINE.formatDate(booking.date))} · ${esc(booking.time)}</li>
        <li>Seats ${esc(booking.seats.join(", "))}</li>
        <li>${CINE.money(booking.total)}</li>
      </ul>
      <div class="actions">
        <a class="primary" href="tickets.html">My tickets</a>
        <a class="ghost" href="bookings.html">Book another</a>
      </div>
    </div>`;
}

function renderSteps() {
  const order = ["movie", "theater", "show", "seats"];
  const labels = { movie: "Movie", theater: "Branch", show: "Showtime", seats: "Seats" };
  const current = state.step === "done" ? "seats" : state.step;
  const index = order.indexOf(current);
  document.getElementById("steps").innerHTML = order.map((step, i) => {
    const cls = i < index || state.step === "done" ? "is-done" : i === index ? "is-current" : "";
    return `<li class="${cls}">${labels[step]}</li>`;
  }).join("");
}

function render() {
  const root = document.getElementById("booking-root");
  renderSteps();
  const view = {
    movie: renderMovie,
    theater: renderTheater,
    show: renderShow,
    seats: renderSeats,
    done: renderDone
  }[state.step];
  root.innerHTML = view();
}

function onClick(event) {
  const movie = event.target.closest("[data-movie]");
  if (movie) {
    state.movieId = movie.getAttribute("data-movie");
    go("theater");
    return;
  }
  const theater = event.target.closest("[data-theater]");
  if (theater) {
    state.theaterId = theater.getAttribute("data-theater");
    go("show");
    return;
  }
  const date = event.target.closest("[data-date]");
  if (date) {
    state.date = date.getAttribute("data-date");
    state.time = "";
    state.seats = [];
    render();
    return;
  }
  const time = event.target.closest("[data-time]");
  if (time && !time.disabled) {
    state.time = time.getAttribute("data-time");
    state.screen = Number(time.getAttribute("data-screen"));
    state.seats = [];
    go("seats");
    return;
  }
  const back = event.target.closest("[data-go]");
  if (back) {
    go(back.getAttribute("data-go"));
    return;
  }
  const seat = event.target.closest("[data-seat]");
  if (seat && !seat.disabled) {
    const id = seat.getAttribute("data-seat");
    if (state.seats.includes(id)) {
      state.seats = state.seats.filter((item) => item !== id);
    } else if (state.seats.length >= 8) {
      state.notice = "You can hold up to 8 seats on one booking.";
    } else {
      state.seats.push(id);
      state.notice = "";
    }
    render();
    return;
  }
  if (event.target.id === "confirm") confirmBooking();
}

function confirmBooking() {
  if (new Date(`${state.date}T${state.time}:00`).getTime() <= Date.now()) {
    state.notice = "That screening has already started. Pick a later showtime.";
    state.time = "";
    state.seats = [];
    state.step = "show";
    render();
    return;
  }
  if (!Store.session()) {
    saveDraft();
    location.href = `login.html?next=${encodeURIComponent("bookings.html?resume=1")}`;
    return;
  }
  const result = Store.createBooking({
    showKey: showKey(),
    movieId: state.movieId,
    theaterId: state.theaterId,
    date: state.date,
    time: state.time,
    screen: state.screen,
    seats: state.seats
  });
  if (!result.ok) {
    state.notice = result.error;
    if (result.clash) state.seats = state.seats.filter((seat) => !result.clash.includes(seat));
    render();
    return;
  }
  state.done = result.booking;
  state.step = "done";
  render();
}

const params = new URLSearchParams(location.search);
const requested = params.get("movie");
if (CINE.movie(requested)) state.movieId = requested;
restoreDraft();
if (state.step === "movie" && state.movieId) state.step = "theater";

document.getElementById("booking-root").addEventListener("click", onClick);
render();
