import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Test/_utils/Count3/Count3.css");
function Count3() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", { className: "count3" }, "test/count3"),
                Mini.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Count3;
