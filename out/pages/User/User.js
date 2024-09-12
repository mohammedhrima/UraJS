import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/User/User.css");
function History() {
    return {
        key: null,
        render: () => {
            Mini.element("div", { className: "history" },
                Mini.element("h3", null, "vs "),
                Mini.element("img", { src: "assets/images/001.png" }),
                Mini.element("h3", null, "User_name"),
                Mini.element("h3", null, "17:05"),
                Mini.element("span", null));
        },
    };
}
function Play({ path }) {
    const [key, state] = Mini.initState(); // Initialize state
    const [getHover, setHover] = state(false);
    const [getStyle, setStyle] = state({
        position: "absolute",
        visibility: "hidden",
    });
    const handleHover = () => {
        // console.log("set hover to ", !hover.value);
        setHover(!getHover());
        if (getHover())
            setStyle({ ...getStyle(), visibility: "visible" });
        else
            setStyle({ ...getStyle(), visibility: "hidden" });
        // console.log(styling.value);
    };
    return {
        key: key,
        render: () => {
            Mini.element("div", { className: "play_game", onmouseover: handleHover, onmouseout: handleHover },
                Mini.element("img", { src: path, loading: "lazy", style: {
                        width: "100%",
                        borderRadius: "10px",
                        minWidth: "100px",
                        transition: "filter 0.35s ease",
                    } }),
                Mini.element("h2", { style: getStyle() }, "Play"));
        },
    };
}
function User() {
    console.log("User component rendered");
    const UserLevel = 60;
    const [key, state] = Mini.initState(); // Initialize state
    const Go = (e) => { };
    return {
        key: key,
        render: () => {
            return (Mini.element("div", { id: "home" },
                Mini.element("div", { className: "components" },
                    Mini.element("div", { className: "user" },
                        Mini.element("div", { className: "info" },
                            Mini.element("img", { src: "assets/images/001.svg", loading: "lazy" }),
                            Mini.element("div", { className: "infos" },
                                Mini.element("h2", null, "Mohammed hrima"),
                                Mini.element("button", { onclick: (e) => Go(e) }, "Clique me")))),
                    Mini.element("div", { className: "game" },
                        Mini.element("div", { className: "infos" },
                            Mini.element("div", { className: "box" },
                                Mini.element("div", { className: "perecent" },
                                    Mini.element("svg", { style: { width: "150px", height: "150px" } },
                                        Mini.element("circle", { cx: "70", cy: "70", r: "70" }),
                                        Mini.element("circle", { cx: "70", cy: "70", r: "70", style: {
                                                strokeDashoffset: `calc(440 - (440 * ${UserLevel}) / 100)`,
                                            } })),
                                    Mini.element("div", { className: "number" },
                                        Mini.element("h2", null,
                                            UserLevel,
                                            Mini.element("span", null, "%"))))),
                            Mini.element("div", { className: "histories" },
                                Mini.element("h2", null, "History"),
                                Mini.element("div", { className: "table" },
                                    Mini.element(History, null),
                                    Mini.element(History, null)))),
                        Mini.element("div", { className: "play" },
                            Mini.element(Play, { path: "assets/images/001.png" }),
                            Mini.element(Play, { path: "assets/images/002.png" }),
                            Mini.element(Play, { path: "assets/images/003.png" }))),
                    Mini.element("div", { className: "chat" },
                        Mini.element("div", { className: "chat_info" }, "this div 3")))));
        },
    };
}
export default User;
