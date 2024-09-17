// pages/Test/Test.tsx
import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Test/Test.css");
function Test() {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element("root", null,
                Mini.element(Mini.fragment, null,
                    Mini.element("div", { id: "test" },
                        "Test counter ",
                        getter()),
                    Mini.element("br", null),
                    Mini.element("button", { onclick: () => {
                            setter(getter() + 1);
                        } }, "clique me"))));
        },
    };
}
export default Test;
