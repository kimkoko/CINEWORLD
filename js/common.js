function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function safeNext(value, fallback) {
  if (value && /^(index|bookings|tickets|events|movie|login)\.html(\?[a-z0-9_=&%-]+)?$/i.test(value)) {
    return value;
  }
  return fallback;
}

function renderNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    const file = (link.getAttribute("href") || "").split("?")[0];
    if (file === path) link.classList.add("is-current");
  });

  const user = Store.session();
  const login = document.querySelector('.nav a[href="login.html"]');
  if (!login || !user) return;

  const hello = document.createElement("li");
  hello.className = "nav-hello";
  hello.textContent = user.username;
  login.parentElement.parentElement.insertBefore(hello, login.parentElement);
  login.textContent = "Logout";
  login.classList.remove("is-current");
  login.setAttribute("href", "#logout");
  login.addEventListener("click", (event) => {
    event.preventDefault();
    Store.logout();
    location.href = "index.html";
  });
}

renderNav();
