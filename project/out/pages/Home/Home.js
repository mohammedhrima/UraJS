import Ura from "ura";
function Nav(props) {
    const [state, render] = Ura.init();
    const [getter, setter] = state(10);
    return render((props) => (Ura.element("div", null,
        Ura.element("h1", null,
            "this is Nav ",
            props.id),
        Ura.element("button", { onclick: () => { setter(getter() + 1); } },
            "clique me ",
            props.id,
            " : ",
            getter()))));
}
function Home() {
    const [state, render] = Ura.init();
    const [getter, setter] = state(10);
    return render(() => (Ura.element("root", null,
        Ura.element("h1", null,
            "this is home ",
            getter()),
        Ura.element("button", { onclick: () => { setter(getter() + 1); } }, "clique me"),
        Ura.element(Nav, { id: getter() ? "a0" : "a1" }),
        Ura.element(Nav, { id: getter() % 2 != 0 ? "b0" : "b1" }))));
}
export default Home;
