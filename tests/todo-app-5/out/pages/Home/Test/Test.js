// pages/Home/Test/Test.jsx
import Mino from "../../../Minotaur/code.js";
Mino.loadCSS("pages/Home/Test/Test.css");
function Test() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mino.element(Mino.fragment, null,
                Mino.element("div", { id: "test" },
                    "home/test counter ",
                    getter()),
                Mino.element("br", null),
                Mino.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Test;
