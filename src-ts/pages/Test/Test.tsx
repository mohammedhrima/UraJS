import Mini from "../../mini/mini";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("src-ts/pages/Test/Test.css");

function Test(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    component: () => {
      return <div>Test</div>;
    },
  };
}
export default Test;
