// pages/Todo/Todo.tsx
import Mini from "../../mini/mini.js";
// import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Todo/Todo.css");
function Todo() {
    console.log("call Todo");
    const [key, state] = Mini.initState();
    const [getter0, setter0] = state("abc");
    const [getter1, setter1] = state(123);
    const [getter2, setter2] = state(["task 0", "task 1", "task 2"]);
    // function addTask(task) {
    //   setter0([...getter0(), task]);
    // }
    // console.log(getter0());
    let value = "";
    function handleClique(e) {
        console.log("hello", e.target.value);
    }
    return {
        key: key,
        render: () => {
            return (Mini.element("root", null,
                Mini.element("h1", null, "Todo page"),
                Mini.element("h1", null, getter0()),
                Mini.element("h1", null, getter1()),
                Mini.element("loop", { on: getter2(), exec: (elem) => {
                        return Mini.element("h1", null, elem);
                    } }),
                Mini.element("input", { oninput: (e) => {
                        value = e.target.value;
                    } }),
                Mini.element("button", { onclick: () => {
                        //@ts-ignore
                        setter2([...getter2(), value]);
                        // setter1(2)
                        // console.log(value);
                    } }, "submit")));
        },
    };
}
export default Todo;
