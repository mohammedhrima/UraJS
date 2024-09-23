// pages/Home/_utils/Component/Component.jsx
import Mino from "../../../../Minotaur/code.js";

Mino.loadCSS("pages/Home/_utils/Component/Component.css");

function Component() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div className="component">home/component</div>
          <br />
          <button
              onclick={() => {
                setter(getter() + 1);
              }} >
            clique me
          </button>
        </>
      );
    },
  };
}
export default Component;
