import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    const [set, get] = state(10);
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" }, "text 1 text 2 text 3"));
        },
    };
}
export default Home;
