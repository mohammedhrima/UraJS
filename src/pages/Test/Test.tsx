// pages/Test/Test.tsx
import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/Test/Test.css");

function Test(): MiniComponent {
  const [key, state] = Mini.initState();
  const [getter, setter] = state<number>(0)
  return {
    key: key,
    render: () => {
      return (
        <root>
          <>
          <div id="test">Test counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
          </>
        </root>
      );
    },
  };
}
export default Test;
