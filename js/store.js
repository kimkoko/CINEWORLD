const Store = (() => {
  const USERS = "cw_users";
  const SESSION = "cw_session";
  const BOOKINGS = "cw_bookings";

  function read(storage, key, fallback) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function session() {
    return read(sessionStorage, SESSION, null) || read(localStorage, SESSION, null);
  }

  function setSession(username, remember) {
    const payload = { username };
    sessionStorage.removeItem(SESSION);
    localStorage.removeItem(SESSION);
    write(remember ? localStorage : sessionStorage, SESSION, payload);
  }

  function findUser(username) {
    const name = username.trim().toLowerCase();
    return read(localStorage, USERS, []).find((user) => user.username.toLowerCase() === name) || null;
  }

  function register(username, password) {
    const name = username.trim();
    if (!/^[A-Za-z0-9]{3,16}$/.test(name)) {
      return { ok: false, error: "Use 3–16 letters or numbers for the username." };
    }
    if (password.length < 4) {
      return { ok: false, error: "Use at least 4 characters for the password." };
    }
    if (findUser(name)) {
      return { ok: false, error: "That username is already taken in this browser." };
    }
    const users = read(localStorage, USERS, []);
    users.push({ username: name, password });
    write(localStorage, USERS, users);
    return { ok: true, username: name };
  }

  function login(username, password, remember) {
    const user = findUser(username);
    if (!user || user.password !== password) {
      return { ok: false, error: "Username or password does not match." };
    }
    setSession(user.username, remember);
    return { ok: true, username: user.username };
  }

  function logout() {
    sessionStorage.removeItem(SESSION);
    localStorage.removeItem(SESSION);
  }

  function resetPassword(username, password) {
    if (password.length < 4) {
      return { ok: false, error: "Use at least 4 characters for the new password." };
    }
    const users = read(localStorage, USERS, []);
    const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { ok: false, error: "No account uses that username on this browser." };
    }
    user.password = password;
    write(localStorage, USERS, users);
    return { ok: true, username: user.username };
  }

  function occupied(showKey) {
    const booked = read(localStorage, BOOKINGS, [])
      .filter((item) => item.showKey === showKey && !item.cancelled)
      .flatMap((item) => item.seats);
    return [...new Set([...CINE.seedSold(showKey), ...booked])];
  }

  function makeId() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "CW-";
    for (let i = 0; i < 6; i += 1) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return id;
  }

  function createBooking(input) {
    const user = session();
    if (!user) return { ok: false, error: "Log in to finish the booking." };
    if (!input.seats.length) return { ok: false, error: "Choose at least one seat." };

    const taken = new Set(occupied(input.showKey));
    const clash = input.seats.filter((seat) => taken.has(seat));
    if (clash.length) {
      return { ok: false, error: `${clash.join(", ")} just sold. Pick those seats again.`, clash };
    }

    const booking = {
      id: makeId(),
      username: user.username,
      showKey: input.showKey,
      movieId: input.movieId,
      theaterId: input.theaterId,
      date: input.date,
      time: input.time,
      screen: input.screen,
      seats: CINE.sortSeats(input.seats),
      total: input.seats.length * CINE.price,
      createdAt: new Date().toISOString(),
      cancelled: false
    };
    const all = read(localStorage, BOOKINGS, []);
    all.push(booking);
    write(localStorage, BOOKINGS, all);
    return { ok: true, booking };
  }

  function cancel(id) {
    const user = session();
    if (!user) return { ok: false, error: "Log in first." };
    const all = read(localStorage, BOOKINGS, []);
    const booking = all.find((item) => item.id === id && item.username === user.username);
    if (!booking) return { ok: false, error: "That ticket is not on this account." };
    if (booking.cancelled) return { ok: false, error: "That ticket is already cancelled." };
    const start = new Date(`${booking.date}T${booking.time}:00`);
    if (start.getTime() <= Date.now()) {
      return { ok: false, error: "This screening has already started, so the ticket stays." };
    }
    booking.cancelled = true;
    write(localStorage, BOOKINGS, all);
    return { ok: true };
  }

  function mine() {
    const user = session();
    if (!user) return [];
    return read(localStorage, BOOKINGS, [])
      .filter((item) => item.username === user.username)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return {
    session,
    register,
    login,
    logout,
    resetPassword,
    occupied,
    createBooking,
    cancel,
    mine
  };
})();
