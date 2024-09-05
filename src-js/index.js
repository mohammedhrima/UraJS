import Mini from "./mini.js";
const Func = () => {
    const [index, count, setCount] = Mini.useState(123);
    return (Mini.Element("state", { watch: index },
        Mini.Element("button", { onclick: () => {
                console.log("click", count());
                setCount(count() + 1);
            } },
            "clique me ",
            count())));
};
let root = document.getElementById("root");
Mini.render(Mini.Element(Func, null)).mount(root);
