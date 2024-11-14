// pages/User/User.jsx
import Ura from "../../Ura/code.js";

Ura.loadCSS("pages/User/User.css");

function User() {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state(0);

  const handleClique = () => setter(getter() + 1);

  return render(() => (
    <root>
      <div id="user">user counter {getter()}</div>
      <br />
      <button onclick={handleClique}>clique me</button>
    </root>
  ));
}
export default User;
