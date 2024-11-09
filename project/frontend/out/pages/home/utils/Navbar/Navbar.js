import Ura from 'ura';
function Navbar() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "navbar" },
        Ura.element("h1", null, "Hello from Navbar component!"),
        Ura.element("button", { onclick: () => setter(getter() + 1) },
            "clique me [",
            getter(),
            "]"))));
}
export default Navbar;
