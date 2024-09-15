import Mini from "../../mini/mini.js";
import Count from "./_utils/Count/Count.js";

Mini.loadCSS("pages/Test/Test.css");

function Test() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          {/* <Count index={0} /> */}
          {/* <Count index={1} /> */}
          {/* <Count index={2} /> */}
          <Count index={3} />
        </get>
      );
    },
  };
}
export default Test;
