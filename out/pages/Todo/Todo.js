Mini.loadCSS("pages/Todo/Todo.css");
import Mini from "../../mini/mini.js";
function Todo() {
    const [key, state] = Mini.initState();
    return {
        key: key,
        render: () => {
            return (Mini.element("get", { by: "#root" },
                Mini.element("div", { className: "todo" }, "Todo")));
        },
    };
}
export default Todo;
