import Ura from "ura";
function Navbar() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "navbar" },
        Ura.element("div", { id: "logo" },
            Ura.element("img", { src: "/assets/tr.png" }),
            "Clashers"),
        Ura.element(Ura.fragment, null,
            Ura.element("button", { id: "login-btn" },
                Ura.element("h4", null, "Login")),
            Ura.element("button", { id: "signup-btn" },
                Ura.element("h4", null, "Sign up"))))));
}
export default Navbar;
