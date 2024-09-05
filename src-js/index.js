import Mini from "./mini.js";
const Func = () => {
    return (Mini.Element("div", null,
        "func tag",
        Mini.Element("button", { onclick: () => {
                console.log("hey");
            }, style: {
                color: "red",
            } }, "clique me")));
};
let root = document.getElementById("root");
Mini.render(Mini.Element(Func, null)).mount(root);
