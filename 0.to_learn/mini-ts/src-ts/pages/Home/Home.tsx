import Mini from "../../mini/mini.js";
import { MiniComponent, Props } from "../../mini/types.js";
Mini.loadCSS("src-js/pages/Home/Home.css");

function Home(props:Props): MiniComponent {
  const [key, state] = Mini.initState();
  const [setValue, getValue] = state<number>(0);
  return {
    key: key,
    component: () => {
      return (
        <>
          <div id={"home"}>Mini Js</div>
        </>
      );
    },
  };
}
export default Home;
