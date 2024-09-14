import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Home/Home.css");

function Home(): MiniComponent {
  const [key, state] = Mini.initState();
  const [getPath, setPath] = state<string>("");
  let text = "";
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div>Home</div>
          <input
            oninput={(e) => {
              text = e.target.value;
            }}
          />
          <button
            onclick={() => {
              Mini.navigate(text, { id: 123, name: "mohammed" });
            }}
          >
            clique me
          </button>
        </get>
      );
    },
  };
}
export default Home;
