import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Home/_utils/Navbar/Navbar.css");
function Navbar() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", { className: "navbar" }, "home/navbar"),
                Mini.element("br", null),
                Mini.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Navbar;
