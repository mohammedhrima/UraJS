// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";
import Comp from "./_utils/Comp/Comp.js";
Mino.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    const [gettArr, setArr] = state(["task 1", "task 2", "task 3"]);
    // const add = () => {
    //   setArr([...gettArr(), "hello"]);
    //   console.log("new array:", gettArr());
    // };
    return {
        key: key,
        render: () => {
            return (Mino.element("root", null,
                Mino.element("if", { cond: true },
                    Mino.element(Comp, { id: "odd" })),
                Mino.element("if", { cond: true },
                    Mino.element(Comp, { id: "even" })),
                "==============================================================",
                Mino.element("br", null),
                Mino.element("button", { onclick: () => setter(getter() + 1) },
                    "clique me ",
                    getter())));
        },
    };
}
export default Home;
