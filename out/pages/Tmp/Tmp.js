import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Tmp/Tmp.css");
function Tmp() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", null, "Tmp")));
        },
    };
}
export default Tmp;
