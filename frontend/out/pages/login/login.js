import Ura from "ura";
import Navbar from "../utils/Navbar/Navbar.jsx";
import Arrow from "../utils/Arrow/Arrow.jsx";
function Login() {
    const [render, State] = Ura.init();
    const [getCheck, setCheck] = State(true);
    const checkbox = (e) => {
        e.preventDefault();
        setCheck(e.target.checked);
    };
    return render(() => (Ura.element("div", { className: "login" },
        Ura.element(Navbar, null),
        Ura.element("div", { id: "center" },
            Ura.element("div", { id: "card" },
                Ura.element("h3", { id: "title" }, "Login"),
                Ura.element("div", { id: "input-section" },
                    Ura.element("input", { type: "text", placeholder: "Username" }),
                    Ura.element("input", { type: "password", placeholder: "Password" }),
                    Ura.element("div", { id: "checkbox" },
                        Ura.element("label", null,
                            Ura.element("input", { type: "checkbox", onChange: checkbox }),
                            " Remember me"))),
                Ura.element("div", { id: "button-section" },
                    Ura.element("button", { id: "btn" },
                        Ura.element(Arrow, null))),
                Ura.element("h4", { id: "signin", onclick: () => {
                        Ura.navigate("/signup");
                    } }, "Don't have an account ?"))))));
}
export default Login;
