// pages/Home/_utils/Navbar/Navbar.jsx
import Ura from "../../../../Ura/code.js";
Ura.loadCSS("./Navbar.css");
function Navbar() {
    const { state, render } = Ura.createComponent();
    const [getter, setter] = state(0);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element(Ura.fragment, null,
        Ura.element("div", { className: "Navbar" },
            "Navbar counter ",
            getter()),
        Ura.element("br", null),
        Ura.element("button", { onclick: handleClique }, "clique me"))));
}
export default Navbar;
