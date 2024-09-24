// pages/Home/_utils/Nav/Nav.jsx
import Ura from "../../../../Ura/code.js";
Ura.loadCSS("pages/Home/_utils/Nav/Nav.css");
function Nav() {
    const { state, render } = Ura.createComponent();
    const [getter, setter] = state(0);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element(Ura.fragment, null,
        Ura.element("div", { className: "nav" },
            "home/nav counter ",
            getter()),
        Ura.element("br", null),
        Ura.element("button", { onclick: handleClique }, "clique me"))));
}
export default Nav;
