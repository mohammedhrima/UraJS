import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Test/Test.css");

function Test(params): MiniComponent {
  const [key, state] = Mini.initState();
  console.log( "call", params);
  
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div>Test</div>
        </get>
      );
    },
  };
}
export default Test;
    