import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    const [getPath, setPath] = state("");
    let text = "";
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "Home"),
                Mini.element("input", { oninput: (e) => {
                        text = e.target.value;
                    } }),
                Mini.element("button", { onclick: () => {
                        Mini.navigate(text, { id: 123, name: "mohammed" });
                    } }, "clique me")));
        },
    };
}
export default Home;
