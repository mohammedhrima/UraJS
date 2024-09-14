import Mini from "./mini/mini.js";
import Home from "./pages/Home/Home.js";
Mini.loadCSS("./src-js/main.css");
function Test1() {
    return {
        key: null,
        component: () => {
            return (Mini.element("h1", null, "test 1"));
        },
    };
}
function Test2() {
    return {
        key: null,
        component: () => {
            return Mini.element("h1", null, "test2");
        },
    };
}
Mini.display(Mini.element("get", { by: "#root" },
    Mini.element(Mini.Routes, { path: "/", call: Mini.element(Home, null) })));
