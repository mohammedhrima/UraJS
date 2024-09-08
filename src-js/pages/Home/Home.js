import Mini from "../../mini/mini.js";
Mini.loadCSS("src-js/pages/Home/Home.css");
function Home(props) {
    console.log("Home receive: ", props);
    const [key, state] = Mini.initState();
    const [setValue, getValue] = state(0);
    return {
        key: key,
        component: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", null, "Mini Js")));
        },
    };
}
export default Home;
