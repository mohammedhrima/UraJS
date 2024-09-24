// pages/Home/_utils/Nav/Nav.jsx
import Ura from "../../../../Ura/code.js";

Ura.loadCSS("pages/Home/_utils/Nav/Nav.css");

function Nav() {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state(0);

  const handleClique = () => setter(getter() + 1);

  return render(() => (
    <>
      <div className="nav">home/nav counter {getter()}</div>
      <br />
      <button onclick={handleClique}>clique me</button>
    </>
  ));
}
export default Nav;
