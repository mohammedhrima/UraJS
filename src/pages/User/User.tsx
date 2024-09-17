// pages/User/User.tsx
import Mini from "../../mini/mini.js";
import { MiniComponent } from "../../mini/types.js";
Mini.loadCSS("pages/User/User.css");

function User(): MiniComponent {
  const [key, state] = Mini.initState();
  const [getter, setter] = state<number>(0);
  return {
    key: key,
    render: () => {
      return (
        <root>
          <div id="user">User counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              console.log("clique");
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </root>
      );
    },
  };
}
export default User;
