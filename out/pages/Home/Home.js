import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");
function Home(props) {
    console.log("home receive this", props);
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return Mini.element("div", null, "Home");
        },
    };
}
export default Home;
