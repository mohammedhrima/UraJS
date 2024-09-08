// import * from "./main.css"
// @import url(' http://server/stylesheet.css ');
import Mini from "./mini/mini.js";
import User from "./pages/User/User.js";
Mini.loadCSS("./src-js/main.css");
console.log("hello");
function App() {
    return {
        key: null,
        component: () => {
            return (Mini.element("div", null,
                Mini.element(User, null)));
        },
    };
}
Mini.display(Mini.element(Mini.get, { by: "#root" },
    Mini.element(App, null)));
