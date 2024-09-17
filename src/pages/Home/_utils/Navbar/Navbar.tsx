import Mini from "../../../../mini/mini.js";
import { MiniComponent } from "../../../../mini/types.js";
Mini.loadCSS("pages/Home/_utils/Navbar/Navbar.css");

function Navbar(): MiniComponent {
  const [key, state] = Mini.initState();
  const [getter, setter] = state<number>(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div className="navbar">home/navbar</div>
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
export default Navbar;
