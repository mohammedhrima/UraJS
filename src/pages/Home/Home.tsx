import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Home/Home.css");

function Home(props): MiniComponent {
  console.log("home receive this", props);
  
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return <div>Home</div>;
    },
  };
}
export default Home;
