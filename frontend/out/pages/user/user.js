import Ura from 'ura';
import Navbar from '../utils/Navbar/Navbar.jsx';
function User() {
    const [render, State] = Ura.init();
    const [getter, setter] = State(0);
    return render(() => (Ura.element("div", { className: "user" },
        Ura.element(Navbar, null),
        Ura.element("div", { id: "center" }),
        Ura.element("div", { id: "bottom" },
            Ura.element("div", { className: "user-card" },
                Ura.element("img", { src: "/assets/profile.png", alt: "" }),
                Ura.element("h3", null, "Hrima mohammed")),
            Ura.element("div", { id: "games" },
                Ura.element("h1", null, "this is games")),
            Ura.element("div", { id: "friends" },
                Ura.element("h1", null, "this is friends"))))));
}
export default User;
