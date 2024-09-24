// pages/Home/Home.jsx
import Ura from "../../Ura/code.js";
import Nav from "./_utils/Nav/Nav.js";
Ura.loadCSS("pages/Home/Home.css");
function Home() {
    const { state, render } = Ura.createComponent();
    const [getter, setter] = state(0);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element("root", null,
        Ura.element(Nav, null),
        Ura.element("div", { id: "home" },
            "home counter ",
            getter()),
        Ura.element("br", null),
        Ura.element("button", { onclick: handleClique }, "clique me"))));
}
export default Home;
