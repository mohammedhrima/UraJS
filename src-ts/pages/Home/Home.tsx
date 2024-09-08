import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("src-js/pages/Home/Home.css");

function Home(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    component: () => {
      return <div>Home</div>;
    },
  };
}
export default Home;
