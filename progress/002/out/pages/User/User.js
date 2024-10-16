// pages/User/User.jsx
import Ura from "../../Ura/code.js";
Ura.loadCSS("pages/User/User.css");
function User() {
    const { state, render } = Ura.createComponent();
    const [getter, setter] = state(0);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element("root", null,
        Ura.element("div", { id: "user" },
            "user counter ",
            getter()),
        Ura.element("br", null),
        Ura.element("button", { onclick: handleClique }, "clique me"))));
}
export default User;
