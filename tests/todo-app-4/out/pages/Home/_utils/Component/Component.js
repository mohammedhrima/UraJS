// pages/Home/_utils/Component/Component.jsx
import Mino from "../../../../Minotaur/code.js";
Mino.loadCSS("pages/Home/_utils/Component/Component.css");
function Component() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mino.element("div", null,
                Mino.element("div", { className: "component" }, "home/component"),
                Mino.element("br", null),
                Mino.element("button", { onclick: () => {
                        setter(getter() + 1);
                        console.log("clique", getter());
                    } },
                    "clique me [",
                    getter(),
                    "]")));
        },
    };
}
export default Component;
