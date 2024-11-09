import Ura from 'ura';
function Play(props) {
    const [render, State] = Ura.init();
    const [setHover, getHover] = State(false);
    const getStyle = () => {
        if (getHover())
            return {
                position: "absolute",
                visibility: "hidden",
            };
        return {
            position: "absolute",
            visibility: "visible",
        };
    };
    const handleHover = () => setHover(!getHover());
    return render(() => (Ura.element("div", { className: "play_game", hover: handleHover },
        Ura.element("img", { src: props.path, loading: "lazy", style: {
                width: "100%",
                borderRadius: "10px",
                minWidth: "100px",
                transition: "filter 0.35s ease",
            } }),
        Ura.element("h2", { style: getStyle() }, "Play"))));
}
function History() {
    const [render, State] = Ura.init();
    return render(() => (Ura.element("div", { className: "history" },
        Ura.element("h3", null, "vs "),
        Ura.element("img", { src: "assets/007.png" }),
        Ura.element("h3", null, "User name"),
        Ura.element("h3", null, "17:05"),
        Ura.element("span", null))));
}
function Game(props) {
    const [render, State] = Ura.init();
    return render(() => (Ura.element("div", { className: "game" },
        Ura.element("div", { className: "infos" },
            Ura.element("div", { className: "box" },
                Ura.element("div", { className: "perecent" },
                    Ura.element("svg", { style: { width: "150px", height: "150px" } },
                        Ura.element("circle", { cx: "70", cy: "70", r: "70" }),
                        Ura.element("circle", { cx: "70", cy: "70", r: "70", style: { strokeDashoffset: `calc(440 - (440 * ${props.UserLevel}) / 100)` } })),
                    Ura.element("div", { className: "number" },
                        Ura.element("h2", null,
                            props.UserLevel,
                            Ura.element("span", null, "%"))))),
            Ura.element("div", { className: "histories" },
                Ura.element("h2", null, "History"),
                Ura.element("div", { className: "table" },
                    Ura.element(History, null),
                    Ura.element(History, null)))),
        Ura.element("div", { className: "play" },
            Ura.element(Play, { path: "assets/002.png" }),
            Ura.element(Play, { path: "assets/003.png" }),
            Ura.element(Play, { path: "assets/004.png" })))));
}
function Home() {
    const [render, State] = Ura.init();
    return render(() => (Ura.element("div", { id: "home" },
        Ura.element("div", { className: "user" },
            Ura.element("div", { className: "info" },
                Ura.element("img", { src: "assets/001.svg", loading: "lazy" }),
                Ura.element("div", { className: "infos" },
                    Ura.element("h2", null, "Mohammed hrima"),
                    Ura.element("button", { onclick: (e) => Ura.navigate("/login") }, "Clique me")))),
        Ura.element(Game, { UserLevel: 60 }),
        Ura.element("div", { className: "chat" },
            Ura.element("div", { className: "chat_info" }, "this div 3")))));
}
export default Home;
