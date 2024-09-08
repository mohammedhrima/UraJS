import Mini from "../../mini/mini";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("src-ts/pages/Home2/Home2.css");

function Home2(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    component: () => {
      return <div>Home2</div>;
    },
  };
}
export default Home2;
