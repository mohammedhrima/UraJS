import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Test/_utils/Count1/Count1.css");
function Count1() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element("div", { className: "count1" }, "test/count1"),
                Mini.element("button", { onclick: () => {
                        setter(getter() + 1);
                    } }, "clique me")));
        },
    };
}
export default Count1;
