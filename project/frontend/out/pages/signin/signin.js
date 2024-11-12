import Ura from "ura";
import Navbar from "../utils/Navbar/Navbar.jsx";
Navbar;
function Signin() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "signin" },
        Ura.element("div", { id: "top" },
            Ura.element(Navbar, null)),
        Ura.element("div", { id: "center" },
            Ura.element("div", { id: "card" },
                Ura.element("h2", { id: "title" }, "Sign in"),
                Ura.element("div", { id: "input-section" },
                    Ura.element("input", { type: "text", id: "usernmae" }),
                    Ura.element("input", { type: "", id: "password" }),
                    Ura.element("h4", null, "remember me")),
                Ura.element("button", null,
                    Ura.element("img", { src: "/assets/arrow.png", alt: "" })),
                Ura.element("h4", { id: "signin" }, "Don't have an account ?"))))));
}
export default Signin;
