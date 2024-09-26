// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";
import Component from "./_utils/Component/Component.js";
Mino.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mino.element("root", null,
                Mino.element(Component, null),
                Mino.element(Component, null),
                Mino.element("h1", null, "Home page"),
                Mino.element("div", { id: "home" },
                    "Home counter ",
                    getter()),
                Mino.element("br", null),
                Mino.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Home;
