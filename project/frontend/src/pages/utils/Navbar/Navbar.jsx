import Ura from "ura";

function Navbar() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="navbar">
      <div id="logo">
        <img src="/assets/tr.png" />
        Clashers
      </div>
      <>
        <button id="login-btn">
          <h4>Login</h4>
        </button>
        <button id="signup-btn">
          <h4>Sign up</h4>
        </button>
      </>
    </div>
  ));
}

export default Navbar;
