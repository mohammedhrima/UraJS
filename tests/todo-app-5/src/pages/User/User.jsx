// pages/User/User.jsx
import Mino from "../../Minotaur/code.js";

Mino.loadCSS("pages/User/User.css");

function User() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => (
        <>
          <div id="user">user counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </>
      )
  };
}
export default User;
