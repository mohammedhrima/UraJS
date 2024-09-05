import Mini from "./mini.js";
const [index, count, setCount] = Mini.useState(1);
const Func = () => {
    console.log("call function");
    return (Mini.Element("button", { onclick: () => {
            console.log("click", count());
            setCount(count() + 1);
        } },
        "clique me ",
        count()));
};
const Func2 = () => {
    return (Mini.Element("get", { find: "#root" },
        Mini.Element("state", { watch: index },
            Mini.Element(Func, null))));
};
Mini.display(Mini.Element(Func2, null)).mount();
