// pages/Home/Home.jsx
import Ura from "../../Ura/code.js";
import Item from "./_utils/Item/Item.jsx";
import Nav from "./_utils/Nav/Nav.js";

Ura.loadCSS("pages/Home/Home.css");

const { state, render } = Ura.createComponßent();

function Home() {
  const [getter, setter] = state(11);

  const handleClique = () => setter(getter() + 1);
  // let x= 10;

  return render(() => (
    <root>
      <div id="home">home counter {getter()}</div>
      <Item value={getter()} />
      <Item value={getter()} />
      <button onclick={handleClique}>home clique me</button>
    </root>
  ), "Home");
}
export default Home;
