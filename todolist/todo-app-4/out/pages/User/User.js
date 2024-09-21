// pages/User/User.jsx
import Mino from "../../Minotaur/code.js";
Mino.loadCSS("pages/User/User.css");
function User() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mino.element("root", null,
                Mino.element("div", { id: "user" }, getter()),
                Mino.element("if", { cond: getter() == 0 },
                    Mino.element("button", { onclick: () => {
                            setter(getter() + 1);
                        } }, "clique me"))));
        },
    };
}
export default User;
