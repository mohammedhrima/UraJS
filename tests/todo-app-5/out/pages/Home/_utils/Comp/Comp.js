// pages/Home/_utils/Comp/Comp.jsx
import Mino from "../../../../Minotaur/code.js";
Mino.loadCSS("pages/Home/_utils/Comp/Comp.css");
function Comp(props) {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mino.element(Mino.fragment, null,
                Mino.element("button", { onclick: () => {
                        console.log("did clique");
                        setter(getter() + 1);
                    } }, "comp btn"),
                Mino.element("h1", null,
                    "value is ",
                    getter(),
                    " props ",
                    props.id),
                Mino.element("br", null)));
        },
    };
}
export default Comp;
