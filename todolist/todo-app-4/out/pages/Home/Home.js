// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";
// Mino.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    let x = 10;
    let arr = ["task 0", "task 1", "task 2"];
    return {
        key: key,
        render: () => {
            return (Mino.element("root", null,
                Mino.element("loop", { on: arr }, (elem) => {
                    return Mino.element("h1", null, elem);
                }),
                Mino.element("if", { cond: x == 11 }, "is true"),
                Mino.element("if", { cond: x != 11 }, "is false"),
                Mino.element("br", null),
                Mino.element("button", { onclick: () => Mino.navigate("/user") }, "navigate")));
        },
    };
}
export default Home;
