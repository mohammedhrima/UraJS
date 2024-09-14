import Mini from "../../mini/mini.js";
Mini.loadCSS("src-js/pages/Home/Home.css");
function Home(props) {
    const [key, state] = Mini.initState();
    const [setValue, getValue] = state(0);
    return {
        key: key,
        component: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", { id: "home" }, "Mini Js")));
        },
    };
}
export default Home;
