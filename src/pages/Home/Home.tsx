// pages/Home/Home.tsx
import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Home/Home.css");

function Home(): MiniComponent {
  const [key, state] = Mini.initState();
  const [getter, setter] = state<number>(0)
  return {
    key: key,
    render: () => {
      return (
        <root>
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
