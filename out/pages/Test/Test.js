import Mini from "../../mini/mini.js";
import Count from "./_utils/Count/Count.js";
Mini.loadCSS("pages/Test/Test.css");
function Test() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element(Count, { index: 3 })));
        },
    };
}
export default Test;
