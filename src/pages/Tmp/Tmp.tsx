import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Tmp/Tmp.css");

function Tmp(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <>
          <div>Tmp</div>
        </>
      );
    },
  };
}
export default Tmp;
    