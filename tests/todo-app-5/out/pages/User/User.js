// pages/User/User.jsx
import Ura from "../../Ura/code.js";
Ura.loadCSS("pages/User/User.css");
function User() {
    const use = Ura.init();
    const [getter, setter] = use.state(0);
    use.render = () => (Ura.element("root", null,
        Ura.element("div", { id: "user" },
            "user counter ",
            getter()),
        Ura.element("br", null),
        Ura.element("button", { onclick: () => {
                setter(getter() + 1);
            } }, "clique me")));
    return use;
}
export default User;
