import Ura from "ura";
function Child(props) {
    const [render, State] = Ura.init();
    const [getter, setter] = State(20);
    return render(() => (Ura.element("fr", null,
        Ura.element("h1", null,
            "child ",
            props.id),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "click ",
            getter()))));
}
function Home() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(10);
    return render(() => (Ura.element("div", null,
        Ura.element("h1", null,
            "hello from Home ",
            getter()),
        Ura.element("button", { onclick: () => Ura.navigate("/test") }, "click"),
        Ura.element(Child, { id: 5 }))));
}
export default Home;
