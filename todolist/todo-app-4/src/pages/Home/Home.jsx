// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";

// Mino.loadCSS("pages/Home/Home.css");

function Home() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0);
  let x = 10;
  let arr = ["task 0", "task 1", "task 2"];
  return {
    key: key,
    render: () => {
      return (
        <root>
          <loop on={arr}>
            {(elem) => {
              return <h1>{elem}</h1>;
            }}
          </loop>
          <if cond={x == 11}>is true</if>
          <if cond={x != 11}>is false</if>
          <br />
          <button onclick={() => Mino.navigate("/user")}>navigate</button>
        </root>
      );
    },
  };
}
export default Home;
