// pages/Home/_utils/Btn/Btn.tsx
import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Home/_utils/Btn/Btn.css");
function Btn(props) {
    const [key, state] = Mini.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mini.element("button", { onclick: () => {
                    setter(getter() + 1);
                } },
                "clique me [",
                props.id,
                "] getter [",
                getter(),
                "]"));
        },
    };
}
export default Btn;
