import Ura from 'ura';
function Chihaja() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "chihaja" },
        Ura.element("h1", null, "Hello from Chihaja component!"),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "clique me [",
            getter(),
            "]"))));
}
export default Chihaja;
