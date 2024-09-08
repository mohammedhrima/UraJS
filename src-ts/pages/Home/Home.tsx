import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
import { Props } from "../../mini/types.js";
Mini.loadCSS("src-js/pages/Home/Home.css");

function Home(props:Props): MiniComponent {
  console.log("Home receive: ", props);
  
  const [key, state] = Mini.initState();
  const [setValue, getValue] = state<number>(0);
  return {
    key: key,
    component: () => {
      return (
        <>
          <div>Mini Js</div>
        </>
      );
    },
  };
}
export default Home;
