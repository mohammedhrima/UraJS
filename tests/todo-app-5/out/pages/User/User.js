// pages/User/User.jsx
import Mino from "../../Minotaur/code.js";
Mino.loadCSS("pages/User/User.css");
function User() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => (Mino.element(Mino.fragment, null,
            Mino.element("div", { id: "user" },
                "user counter ",
                getter()),
            Mino.element("br", null),
            Mino.element("button", { onclick: () => {
                    setter(getter() + 1);
                } }, "clique me")))
    };
}
export default User;
