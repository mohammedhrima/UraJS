import Mini from "../../mini/mini";
Mini.loadCSS("src-ts/pages/Home2/Home2.css");
function Home2() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        component: () => {
            return Mini.element("div", null, "Home2");
        },
    };
}
export default Home2;
