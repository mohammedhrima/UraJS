import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Home/Home.css");

function Home(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div id="home">home</div>
        </get>
      );
    },
  };
}
export default Home;
