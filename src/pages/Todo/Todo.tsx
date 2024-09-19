// pages/Todo/Todo.tsx
import Mini from "../../mini/mini.js";
// import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Todo/Todo.css");

function Todo() {
  console.log("call home");

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
      return (
        <root>
          <h1>home</h1>
          <h1>{getter0()}</h1>
          <h1>{getter1()}</h1>
          <loop
            on={getter2()}
            exec={(elem) => {
              return <h1>{elem}</h1>;
            }}
          />

          <input
            oninput={(e) => {
              value = e.target.value;
            }}
          />
          <button
            onclick={() => {
              //@ts-ignore
              setter2([...getter2(), value]);
              // setter1(2)
              // console.log(value);
            }}
          >
            submit
          </button>
        </root>
      );
    },
  };
}
export default Todo;
