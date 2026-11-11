const params = new URLSearchParams(location.search);
const nextUrl = safeNext(params.get("next"), "index.html");

const loginPart = document.getElementById("loginpart");
const registerPart = document.getElementById("registerpart");
const resetPart = document.getElementById("resetpart");

function showForm(name) {
  loginPart.style.display = name === "login" ? "block" : "none";
  registerPart.style.display = name === "register" ? "block" : "none";
  resetPart.style.display = name === "reset" ? "block" : "none";
}

function setMessage(id, text, ok) {
  const box = document.getElementById(id);
  box.textContent = text;
  box.className = ok ? "msg ok" : "msg";
  box.hidden = !text;
}

function finish(username) {
  setMessage("login-msg", `Signed in as ${username}.`, true);
  location.href = nextUrl;
}

document.getElementById("goto-register").addEventListener("click", (event) => {
  event.preventDefault();
  showForm("register");
});

document.getElementById("goto-login").addEventListener("click", (event) => {
  event.preventDefault();
  showForm("login");
});

document.getElementById("goto-reset").addEventListener("click", (event) => {
  event.preventDefault();
  showForm("reset");
});

document.getElementById("reset-back").addEventListener("click", (event) => {
  event.preventDefault();
  showForm("login");
});

loginPart.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = Store.login(
    document.getElementById("login-user").value,
    document.getElementById("login-pass").value,
    document.getElementById("remember").checked
  );
  if (!result.ok) {
    setMessage("login-msg", result.error, false);
    return;
  }
  finish(result.username);
});

registerPart.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = document.getElementById("reg-pass").value;
  if (password !== document.getElementById("reg-pass2").value) {
    setMessage("reg-msg", "Those passwords do not match.", false);
    return;
  }
  const result = Store.register(document.getElementById("reg-user").value, password);
  if (!result.ok) {
    setMessage("reg-msg", result.error, false);
    return;
  }
  Store.login(result.username, password, true);
  finish(result.username);
});

resetPart.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = Store.resetPassword(
    document.getElementById("reset-user").value,
    document.getElementById("reset-pass").value
  );
  if (!result.ok) {
    setMessage("reset-msg", result.error, false);
    return;
  }
  setMessage("login-msg", `Password updated for ${result.username}. Log in with the new one.`, true);
  showForm("login");
});

if (Store.session() && params.get("next")) {
  location.href = nextUrl;
} else if (Store.session()) {
  setMessage("login-msg", `You are already signed in as ${Store.session().username}.`, true);
}

showForm("login");
