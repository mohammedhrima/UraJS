import Ura from 'ura';
function Play() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "play" },
        Ura.element("h1", null, "Hello from Play component!"),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "clique me [",
            getter(),
            "]"))));
}
export default Play;
