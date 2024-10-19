import Ura from "../ura/code.js";
function Text(props) {
    console.log("call Text tag with", props);
    const [state, render] = Ura.init();
    return render(() => (Ura.element("fr", null,
        Ura.element("h1", null,
            "value ",
            props.value))));
}
function Nav() {
    const [state, render] = Ura.init();
    const [getter, setter] = state(10);
    return render(() => (Ura.element("div", null,
        Ura.element("button", { onclick: () => {
                setter(getter() + 1);
            } }, "hello world"),
        Ura.element(Text, { value: getter() }))));
}
function App() {
    const [state, render] = Ura.init();
    return render(() => (Ura.element("root", null,
        Ura.element(Nav, null))));
}
Ura.display(Ura.element(App, null));
Ura.sync();
