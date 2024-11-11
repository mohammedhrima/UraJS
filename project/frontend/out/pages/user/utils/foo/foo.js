import Ura from 'ura';
function Foo() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "foo" },
        Ura.element("h1", null, "Hello from Foo component!"),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "clique me [",
            getter(),
            "]"))));
}
export default Foo;
