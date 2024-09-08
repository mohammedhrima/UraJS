import Mini from "../../mini/mini";
Mini.loadCSS("src-ts/pages/Test/Test.css");
function Test() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        component: () => {
            return Mini.element("div", null, "Test");
        },
    };
}
export default Test;
