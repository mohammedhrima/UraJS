import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Home/Home.css");

function Home(): MiniComponent {
  const [key, state] = Mini.initState();
  const [set, get] = state<number>(10);
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div id="home">
            <h1>Home page</h1>
            <div>
              <span>text 2</span>
              <br/>
              <span>text 1</span>
              <br/>
              <span>text 1</span>
              <br/>
              <span>text 1</span>
            </div>
          </div>
        </get>
      );
    },
  };
}
export default Home;
