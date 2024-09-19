// pages/Home/Home.jsx
import Mini from "../../mini/mini.js";

Mini.loadCSS("pages/Home/Home.css");

function Home() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <root>
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
