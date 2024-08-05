// TODO: keep it, update it later using routes
// TODO: render the html page in server.js file as string

// import { Mini } from "../../Mini/lib.js";

const Routes = {
  test: "/pages/Test/test.html",
  home: "/pages/Home/home.html",
  login: "/pages/Login/login.html",
};

function loadPage(url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const element = document.getElementById("content");
      element.innerHTML = data;
      const scripts = element.querySelectorAll("script");
      scripts.forEach(async (script) => {
        await import(script.src);
      });
    })
    .catch((error) => console.error("Error loading page:", error));
}

// const PORT = 5000;
// if ("WebSocket" in window) {
//   const ws = new WebSocket('ws://localhost:5000/');
//   ws.onopen = function () {};
//   ws.onmessage = function (event) {
//     if (event.data === "refresh") {
//       console.log("refresh");
//     }
//   };
//   ws.onclose = function () {};
// } else {
//   console.log("WebSocket NOT supported by your Browser!");
// }
loadPage(Routes["home"]);

// Mini.setRoute("/login", "/pages/Login/login.html");
// Mini.setRoute("/", "/pages/Home/home.html");
