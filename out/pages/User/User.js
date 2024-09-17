// pages/User/User.tsx
import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/User/User.css");
function User() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element("root", null,
                Mini.element("div", { id: "user" },
                    "User counter ",
                    getter()),
                Mini.element("br", null),
                Mini.element("button", { onclick: () => {
                        console.log("clique");
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default User;
