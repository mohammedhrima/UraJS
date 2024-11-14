import Ura from "ura";
import Navbar from "../utils/Navbar/Navbar.jsx";
import Arrow from "../utils/Arrow/Arrow.jsx";
function Signup() {
    const [render, State] = Ura.init();
    const [getCheck, setCheck] = State(true);
    const checkbox = (e) => {
        e.preventDefault();
        setCheck(e.target.checked);
    };
    return render(() => (Ura.element("div", { className: "signup" },
        Ura.element(Navbar, null),
        Ura.element("div", { id: "center" },
            Ura.element("div", { id: "card" },
                Ura.element("h3", { id: "title" }, "Sign up"),
                Ura.element("div", { id: "input-section" },
                    Ura.element("input", { type: "text", placeholder: "Firstname" }),
                    Ura.element("input", { type: "text", placeholder: "Lastname" }),
                    Ura.element("br", null),
                    Ura.element("input", { type: "text", placeholder: "Username" }),
                    Ura.element("input", { type: "password", placeholder: "Password" }),
                    Ura.element("input", { type: "password", placeholder: "Confirm Password" })),
                Ura.element("div", { id: "button-section" },
                    Ura.element("button", { id: "btn" },
                        Ura.element(Arrow, null))),
                Ura.element("h4", { id: "signin", onclick: () => {
                        Ura.navigate("/login");
                    } }, "Already have an account ?"))))));
}
export default Signup;
