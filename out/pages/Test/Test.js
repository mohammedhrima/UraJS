import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Test/Test.css");
function Test(params) {
    const [key, state] = Mini.initState();
    console.log("call", params);
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", null, "Test")));
        },
    };
}
export default Test;
