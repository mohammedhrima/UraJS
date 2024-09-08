import Mini from "../../mini/mini.js";
Mini.loadCSS("src-js/pages/Home/Home.css");
function Home() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        component: () => {
            return Mini.element("div", null, "Home");
        },
    };
}
export default Home;
