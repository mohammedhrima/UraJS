// pages/Home/Home.jsx
import Ura from "../../Ura/code.js";
import Item from "./_utils/Item/Item.js";
Ura.loadCSS("pages/Home/Home.css");
const { state, render } = Ura.createComponent();
function Home() {
    const [getter, setter] = state(11);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element("root", null,
        Ura.element("div", { id: "home" },
            "home counter ",
            getter()),
        Ura.element(Item, { value: getter() }),
        Ura.element("button", { onclick: handleClique }, "home clique me"))), "Home");
}
export default Home;
