import Ura from "ura";
function Home() {
    const [render, State] = Ura.init();
    const [getTheme, setTheme] = State("dark");
    const handle = () => {
        setTheme(getTheme() === "light" ? "dark" : "light");
    };
    return render(() => (Ura.element("div", { className: `home ${getTheme()}` },
        Ura.element("header", { className: "home-header" },
            Ura.element("h1", null, "Welcome to UraJS"),
            Ura.element("p", null,
                "Get started by editing ",
                Ura.element("code", null, "src/pages/Home.[js|ts|jsx|tsx]")),
            Ura.element("a", { className: "home-link", href: "https://github.com/mohammedhrima/UraJS", target: "_blank", rel: "noopener noreferrer" }, "Learn UraJS"),
            Ura.element("button", { onClick: handle, className: "toggle-theme" },
                Ura.element("span", null,
                    "Switch to ",
                    getTheme() === "light" ? "Dark" : "Light",
                    " Mode"),
                Ura.element("img", { src: "/assets/logo.png", alt: "logo" }))))));
}
export default Home;
