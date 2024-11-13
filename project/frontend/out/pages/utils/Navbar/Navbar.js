import Ura from "ura";
function Navbar() {
    const [render, State] = Ura.init();
    return render(() => (Ura.element("div", { className: "navbar" },
        Ura.element("div", { id: "logo", onclick: () => {
                Ura.navigate("/home");
            } },
            Ura.element("img", { src: "/assets/tr.png" }),
            "Clashers"),
        Ura.element(Ura.fragment, null,
            Ura.element("button", { id: "login-btn", onclick: () => {
                    Ura.navigate("/login");
                } },
                Ura.element("h4", null, "Login")),
            Ura.element("button", { id: "signup-btn", onclick: () => {
                    Ura.navigate("/signup");
                } },
                Ura.element("h4", null, "Sign up"))))));
}
export default Navbar;
