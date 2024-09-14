import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "home")));
        },
    };
}
export default Home;
