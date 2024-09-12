import Mini from "./mini/mini.js";
import Game from "./pages/Game/Game.js";
import User from "./pages/User/User.js";
import Home from "./pages/Home/Home.js";
Mini.loadCSS("pages/main.css");
Mini.display(Mini.element("get", { by: "#root" },
    Mini.element("route", { path: "/", call: Home }),
    Mini.element("route", { path: "/user", call: User }),
    Mini.element("route", { path: "/game", call: Game })));
console.log(Mini.Routes);
