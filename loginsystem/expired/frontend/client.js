// client.js
const user1 = document.getElementById("user1");
const user2 = document.getElementById("user2");
const user3 = document.getElementById("user3");
const admin = document.getElementById("admin");
const logout = document.getElementById("logout");
const div = document.getElementById("response");

user1.onclick = () => login("user1", "pass1");
user2.onclick = () => login("user2", "pass2");
user3.onclick = () => login("user3", "pass3");

admin.onclick = () => {
  fetch("http://localhost:3000/data", {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.status === 401) {
        throw new Error("Session expired - Please log in again");
      } else if (res.status === 403) {
        throw new Error("Forbidden - Admin access required");
      }
      return res.text();
    })
    .then((data) => (div.textContent = data))
    .catch((error) => (div.textContent = error.message));
};

logout.onclick = () => {
  fetch("http://localhost:3000/logout", {
    method: "POST",
    credentials: "include",
  }).then(() => (div.textContent = "Logged out successfully"));
};

function login(username, password) {
  fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.text())
    .then((data) => (div.textContent = data))
    .catch((error) => (div.textContent = `Error: ${error.message}`));
}

// Optional: Poll server to keep session alive
setInterval(() => {
  fetch("http://localhost:3000/data", { credentials: "include" });
}, 2 * 60 * 1000); // 2 minutes to keep session alive
