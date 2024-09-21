// pages/Test/Test.jsx
import Mino from "../../Minotaur/code.js";

Mino.loadCSS("pages/Test/Test.css");

function Test() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <root>
            <h1>My Todo List</h1>
          <form>
            <input type="text" className="todo-input" />
            <button className="todo-button" type="submit">
              <i className="fas fa-plus-square"></i>
            </button>
            <div className="select">
              <select name="todos" className="filter-todo">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
              </select>
            </div>
          </form>
          <div className="todo-container">
            <ul className="todo-list"></ul>
          </div>
        </root>
      );
    },
  };
}
export default Test;
