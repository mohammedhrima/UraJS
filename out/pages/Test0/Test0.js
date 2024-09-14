import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Test0/Test0.css");
function Test0() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "Test0")));
        },
    };
}
export default Test0;
