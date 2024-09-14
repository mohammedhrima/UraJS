import Mini from "../../../mini/mini.js";
import { MiniComponent } from "../../../mini/types.js";
Mini.loadCSS("pages/Home/Data/Data.css");

function Data(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div id="data">home/data</div>
        </get>
      );
    },
  };
}
export default Data;
