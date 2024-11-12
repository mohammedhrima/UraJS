import Ura from "ura";
import Navbar from "../utils/Navbar/Navbar.jsx";

Navbar;
function Signin() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="signin">
      <div id="top">
        <Navbar />
      </div>
      <div id="center">
        <div id="card">
          <h2 id="title">Sign in</h2>
          <div id="input-section">
            <input type="text" id="usernmae" />
            <input type="" id="password" />
            <h4>remember me</h4>
          </div>
          <button>
            <img src="/assets/arrow.png" alt="" />
          </button>
          <h4 id="signin">Don't have an account ?</h4>
        </div>
      </div>
    </div>
  ));
}

export default Signin;
