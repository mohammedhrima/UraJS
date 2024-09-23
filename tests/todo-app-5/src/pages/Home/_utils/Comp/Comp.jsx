// pages/Home/_utils/Comp/Comp.jsx
import Mino from "../../../../Minotaur/code.js";

Mino.loadCSS("pages/Home/_utils/Comp/Comp.css");

function Comp(props) {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <>
          <button
            onclick={() => {
              console.log("did clique");
              setter(getter() + 1);
            }}
          >
            comp btn
          </button>
          <h1>
            value is {getter()} props {props.id}
          </h1>
          <br />
        </>
      );
    },
  };
}
export default Comp;
