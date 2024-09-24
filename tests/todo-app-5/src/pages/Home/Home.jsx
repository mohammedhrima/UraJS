// pages/Home/Home.jsx
import Ura from "../../Ura/code.js";
import Nav from "./_utils/Nav/Nav.js";

Ura.loadCSS("pages/Home/Home.css");

function Home() {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state(0);

  const handleClique = () => setter(getter() + 1);

  return render(() => (
    <root>
      <Nav></Nav>
      <div id="home">home counter {getter()}</div>
      <br />
      <button onclick={handleClique}>clique me</button>
    </root>
  ));
}
export default Home;
