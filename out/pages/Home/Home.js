// pages/Home/Home.tsx
import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element("root", null,
                Mini.element("div", { id: "home" },
                    "Home counter ",
                    getter()),
                Mini.element("br", null),
                Mini.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Home;
