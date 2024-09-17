import Mini from "../../mini/mini.js";
import Btn from "./_utils/Btn/Btn.js";
Mini.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    const [get, set] = state(10);
    return {
        key: key,
        render: () => {
            return (Mini.element("root", null,
                Mini.element("button", { onclick: () => { set(get() + 1); } },
                    "this is value [",
                    get(),
                    "]"),
                Mini.element("div", { id: "home" },
                    Mini.element(Btn, { id: 0 }),
                    Mini.element(Btn, { id: 1 }),
                    Mini.element(Btn, { id: 2 }),
                    Mini.element(Btn, { id: 3 }))));
        },
    };
}
export default Home;
