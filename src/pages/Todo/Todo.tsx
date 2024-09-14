Mini.loadCSS("pages/Todo/Todo.css");
import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";

function Todo(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div className={"todo"}>Todo</div>
        </get>
      );
    },
  };
}
export default Todo;
