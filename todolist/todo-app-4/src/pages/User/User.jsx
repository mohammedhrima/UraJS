// pages/User/User.jsx
import Mino from "../../Minotaur/code.js";

Mino.loadCSS("pages/User/User.css");

function User() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <root>
          <div id="user">{getter()}</div>
          <if cond={getter() == 0}>
            <button
              onclick={() => {
                setter(getter() + 1);
              }}
            >
              clique me
            </button>
          </if>
        </root>
      );
    },
  };
}
export default User;
