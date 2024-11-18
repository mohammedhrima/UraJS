import Ura from "ura";
function Home() {
    const [render, State] = Ura.init();
    return render(() => (Ura.element("div", { className: "home" },
        Ura.element("header", { className: "home-header" },
            Ura.element("h1", null, "Welcome to UraJS"),
            Ura.element("p", null,
                " Get started by editing ",
                Ura.element("code", null, "src/pages/Home.jsx")),
            Ura.element("a", { className: "home-link", href: "https://github.com/mohammedhrima/UraJS", target: "_blank", rel: "noopener noreferrer" }, "Learn UraJS")))));
}
export default Home;
