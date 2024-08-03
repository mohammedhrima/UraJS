// TODO: keep it, update it later using routes
// TODO: render the html page in server.js file as string
import { Mini } from "../../Mini/lib.js";
var PORT = 5000;
if ("WebSocket" in window) {
    var ws = new WebSocket("ws://localhost:".concat(PORT, "/"));
    ws.onopen = function() {};
    ws.onmessage = function(event) {
        if (event.data === "refresh") {
            document.getElementById("frame").contentWindow.location.reload(true);
            console.log("refresh");
        }
    };
    ws.onclose = function() {};
} else {
    console.log("WebSocket NOT supported by your Browser!");
}
var iframe = document.getElementById("frame");
iframe.src = "dist/pages/Home/home.html";
Mini.Page.iframe = iframe;
Mini.setRoute("/login", "dist/pages/Login/login.html");
Mini.setRoute("/", "dist/pages/Home/home.html");
