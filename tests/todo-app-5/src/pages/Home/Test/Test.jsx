// pages/Home/Test/Test.jsx
import Mino from "../../../Minotaur/code.js";

Mino.loadCSS("pages/Home/Test/Test.css");

function Test() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div id="test">home/test counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </>
      );
    },
  };
}
export default Test;
