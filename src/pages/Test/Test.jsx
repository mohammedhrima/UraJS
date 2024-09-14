import Mini from "../../mini/mini.js";
import Count1 from "./_utils/Count1/Count1.js";
import Count2 from "./_utils/Count2/Count2.js";
import Count3 from "./_utils/Count3/Count3.js";


Mini.loadCSS("pages/Test/Test.css");

function Test() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <Count1/>
          <Count2/>
          <Count3/>
        </get>
      );
    },
  };
}
export default Test;
