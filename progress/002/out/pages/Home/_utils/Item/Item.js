// pages/Home/_utils/Item/Item.jsx
import Ura from "../../../../Ura/code.js";
Ura.loadCSS("./pages/Home/_utils/Item/Item.css");
const { state, render } = Ura.createComponent();
function Item(props) {
    const [getter, setter] = state(22);
    const handleClique = () => setter(getter() + 1);
    return render(() => (Ura.element("div", null,
        Ura.element("h1", null,
            props.value % 2 == 0 ? "odd item" : "even item",
            " [",
            getter(),
            "]"),
        Ura.element("button", { onclick: handleClique }, "item clique me"))), "Item");
}
export default Item;
