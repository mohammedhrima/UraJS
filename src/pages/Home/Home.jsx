import Mini from "../../mini/mini.js";
import Btn from "./_utils/Btn/Btn.js";
Mini.loadCSS("pages/Home/Home.css");

function Home() {
  const [key, state] = Mini.initState();
  const [get, set] = state(10);
  return {
    key: key,
    render: () => {
      return (
        <root>
          <button onclick={() => {set(get() + 1)}} >
            this is value [{get()}]
          </button>
          <div id="home">
            <Btn id={0} />
            <Btn id={1} />
            <Btn id={2} />
            <Btn id={3} />
          </div>
        </root>
      );
    },
  };
}
export default Home;

