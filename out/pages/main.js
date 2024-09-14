import Mini from "../mini/mini.js";
import About from "./About/About.js";
import Home from "./Home/Home.js";
import Test from "./Test/Test.js";
import Test0 from "./Test0/Test0.js";
import Todo from "./Todo/Todo.js";
import User from "./User/User.js";
Mini.loadCSS("pages/main.css");
Mini.display(Mini.element(Mini.fragment, null,
    Mini.element("route", { path: "/home", call: Home },
        Mini.element("route", { path: "/test", call: Test })),
    Mini.element("route", { path: "/test0", call: Test0 }),
    Mini.element("route", { path: "/todo", call: Todo }),
    Mini.element("route", { path: "/about", call: About }),
    Mini.element("route", { path: "/user", call: User })));
