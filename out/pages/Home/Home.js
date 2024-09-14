import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    const [set, get] = state(10);
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", { id: "home" },
                    Mini.element("h1", null, "Home page"),
                    Mini.element("div", null,
                        Mini.element("span", null, "text 2"),
                        Mini.element("br", null),
                        Mini.element("span", null, "text 1"),
                        Mini.element("br", null),
                        Mini.element("span", null, "text 1"),
                        Mini.element("br", null),
                        Mini.element("span", null, "text 1")))));
        },
    };
}
export default Home;
