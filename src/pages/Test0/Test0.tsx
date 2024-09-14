import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Test0/Test0.css");

function Test0(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div>Test0</div>
        </get>
      );
    },
  };
}
export default Test0;
    