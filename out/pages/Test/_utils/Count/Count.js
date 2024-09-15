import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Test/_utils/Count/Count.css");
function Count1({ index }) {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element("button", { onclick: () => {
                    setter(getter() + 1);
                } }, getter()));
        },
    };
}
export default Count1;
