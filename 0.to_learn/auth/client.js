const user1 = document.getElementById("user1");
const user2 = document.getElementById("user2");
const user3 = document.getElementById("user3");
const admin = document.getElementById("admin");
const div = document.getElementById("response");

user1.onclick = () => login("user1");
user2.onclick = () => login("user2");
user3.onclick = () => login("user-none");

admin.onclick = () => {
  fetch("http://localhost:3000/data", {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.status === 401) {
        throw new Error("Unauthorized - Please log in");
      } else if (res.status === 403) {
        throw new Error("Forbidden - Admin access required");
      }
      console.log("response", res);
      
      return res.text();
    })
    .then((data) => (div.textContent = data))
    .catch((error) => (div.textContent = error.message));
};

function login(username) {
  fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  })
    .then((res) => res.text()) // Changed to res.text() to match server's response
    .then((data) => (div.textContent = data))
    .catch((error) => (div.textContent = `Error: ${error.message}`));
}
