// pages/Love/Love.jsx
import Ura from "../../Ura/code.js";

Ura.loadCSS("./Love.css");
    
function Love() {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state(0);
    
  const handleClique = () => setter(getter() + 1);    
  return render(() => (
      <root>
        <div id="Love">Love counter {getter()}</div>
        <br />
        <button onclick={handleClique}>clique me</button>
      </root>
    ));
  }
export default Love;  
