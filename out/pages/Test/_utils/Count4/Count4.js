import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Test/_utils/Count4/Count4.css");
function Count4() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", { className: "count4" }, "test/count4"),
                Mini.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Count4;
