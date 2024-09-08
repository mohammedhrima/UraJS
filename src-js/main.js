import Mini from "./mini/mini.js";
import Home from "./pages/Home/Home.js";
Mini.loadCSS("./src-js/main.css");
function App() {
    return {
        key: null,
        component: () => {
            return (Mini.element("div", null,
                Mini.element(Home, null)));
        },
    };
}
Mini.display(Mini.element(Mini.get, { by: "#root" },
    Mini.element(App, null)));
