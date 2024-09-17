// pages/Home/_utils/Btn/Btn.tsx
import Mini from "../../../../mini/mini.js";
import { MiniComponent } from "../../../../mini/types.js";
Mini.loadCSS("pages/Home/_utils/Btn/Btn.css");

function Btn(props): MiniComponent {
  const [key, state] = Mini.initState();
  const [getter, setter] = state<number>(0);
  return {
    key: key,
    render: () => {
      return (
        <button
          onclick={() => {
            setter(getter() + 1);
          }}
        >
          clique me [{props.id}] getter [{getter()}]
        </button>
      );
    },
  };
}
export default Btn;
