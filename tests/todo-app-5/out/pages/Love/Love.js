// pages/Love/Love.jsx
import Ura from "../../Ura/code.js";
Ura.loadCSS("./Love.css");
function Love() {
    const { state, render } = Ura.createComponent();
    const [getter, setter] = state(0);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element("root", null,
        Ura.element("div", { id: "Love" },
            "Love counter ",
            getter()),
        Ura.element("br", null),
        Ura.element("button", { onclick: handleClique }, "clique me"))));
}
export default Love;
