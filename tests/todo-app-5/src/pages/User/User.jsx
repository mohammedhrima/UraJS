// pages/User/User.jsx
import Ura from "../../Ura/code.js";

Ura.loadCSS("pages/User/User.css");

function User() {
  const use = Ura.init();
  const [getter, setter] = use.state(0);

  use.render = () => (
    <root>
      <div id="user">user counter {getter()}</div>
      <br />
      <button
        onclick={() => {
          setter(getter() + 1);
        }}
      >
        clique me
      </button>
    </root>
  );
  return use;
}

export default User;
