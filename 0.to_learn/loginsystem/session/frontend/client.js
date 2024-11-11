const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const responseDiv = document.getElementById("response");

document.getElementById("register").onclick = () => {
  fetch("http://localhost:3000/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
  })
    .then((res) => res.text())
    .then((data) => (responseDiv.textContent = data))
    .catch((err) => (responseDiv.textContent = `Error: ${err.message}`));
};

document.getElementById("login").onclick = () => {
  fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
  })
    .then((res) => res.text())
    .then((data) => (responseDiv.textContent = data))
    .catch((err) => (responseDiv.textContent = `Error: ${err.message}`));
};

document.getElementById("logout").onclick = () => {
  fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.text())
    .then((data) => (responseDiv.textContent = data))
    .catch((err) => (responseDiv.textContent = `Error: ${err.message}`));
};

document.getElementById("getData").onclick = () => {
  fetch("http://localhost:3000/data", {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.status === 401) throw new Error("Unauthorized - Please log in");
      return res.text();
    })
    .then((data) => (responseDiv.textContent = data))
    .catch((err) => (responseDiv.textContent = `Error: ${err.message}`));
};

window.BeforeUnloadEvent = () => {
  navigator.sendBeacon("http://localhost:3000/close");
};
