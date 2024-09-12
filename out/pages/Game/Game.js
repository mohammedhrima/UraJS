import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Game/Game.css");
function Game() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", null, "Game")));
        },
    };
}
export default Game;
