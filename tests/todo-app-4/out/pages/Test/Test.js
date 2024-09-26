// pages/Test/Test.jsx
import Mino from "../../Minotaur/code.js";
Mino.loadCSS("pages/Test/Test.css");
function Test() {
    const [key, state] = Mino.initState();
    const [getter, setter] = state(0);
    return {
        key: key,
        render: () => {
            return (Mino.element("root", null,
                Mino.element("h1", null, "My Todo List"),
                Mino.element("form", null,
                    Mino.element("input", { type: "text", className: "todo-input" }),
                    Mino.element("button", { className: "todo-button", type: "submit" },
                        Mino.element("i", { className: "fas fa-plus-square" })),
                    Mino.element("div", { className: "select" },
                        Mino.element("select", { name: "todos", className: "filter-todo" },
                            Mino.element("option", { value: "all" }, "All"),
                            Mino.element("option", { value: "completed" }, "Completed"),
                            Mino.element("option", { value: "uncompleted" }, "Uncompleted")))),
                Mino.element("div", { className: "todo-container" },
                    Mino.element("ul", { className: "todo-list" }))));
        },
    };
}
export default Test;
