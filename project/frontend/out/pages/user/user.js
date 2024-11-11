import Ura from "ura";
import Foo from "./utils/foo/foo.js";
function User() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "user" },
        Ura.element(Ura.fragment, null,
            Ura.element(Foo, null),
            Ura.element("h1", null, "Hello from User component!"),
            Ura.element("button", { onclick: () => setter(getter() + 1) },
                "clique me [",
                getter(),
                "]"),
            Ura.element("h1", null, "hello")))));
}
export default User;
