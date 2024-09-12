import Mini from "./mini/mini.js";
import { MiniComponent } from "./mini/types.js";
import Game from "./pages/Game/Game.js";
import User from "./pages/User/User.js";
import Home from "./pages/Home/Home.js";
Mini.loadCSS("pages/main.css");


Mini.display(
  <get by="#root">
    <route path={"/"} call={Home} />
    <route path={"/user"} call={User} />
    <route path={"/game"} call={Game} />
  </get>
);

console.log(Mini.Routes);
