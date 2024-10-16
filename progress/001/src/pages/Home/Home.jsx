// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";
import Component from "./_utils/Component/Component.jsx";

Mino.loadCSS("pages/Home/Home.css");

function Home() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <root>
          <Component/>
          <Component/>
          <h1>Home page</h1>
          <div id="home">Home counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </root>
      );
    },
  };
}
export default Home;
