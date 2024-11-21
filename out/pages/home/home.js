import Ura from "ura";
function Home() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    const handler = (e) => {
        setter(getter() + 1);
    };
    return render(() => (Ura.element("div", { className: "home" },
        Ura.element("button", { onclick: handler }, "clique me"),
        Ura.element("br", null),
        " ",
        Ura.element("br", null),
        Ura.element("h1", null,
            "value is [",
            getter(),
            "]"),
        Ura.element("if", { cond: getter() % 2 === 1 }, "is odd"),
        Ura.element("else", null, "is even"))));
}
export default Home;
