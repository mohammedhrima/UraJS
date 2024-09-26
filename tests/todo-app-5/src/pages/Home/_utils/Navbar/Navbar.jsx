// pages/Home/_utils/Navbar/Navbar.jsx
import Ura from "../../../../Ura/code.js";

Ura.loadCSS("./Navbar.css");
    
function Navbar() {
  const { state, render } = Ura.createComponent();
  const [getter, setter] = state(0);
    
  const handleClique = () => setter(getter() + 1);    
  return render(() => (
      <>
        <div className="Navbar">Navbar counter {getter()}</div>
        <br />
        <button onclick={handleClique}>clique me</button>
      </>
    ));
  }
export default Navbar;  
