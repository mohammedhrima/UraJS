import Ura from "ura";

function Navbar() {
  const [render, State] = Ura.init();


  return render(() => (
    <div className="navbar">
      <div
        id="logo"
        onclick={() => {
          Ura.navigate("/home");
        }}
      >
        <img src="/assets/tr.png" />
        Clashers
      </div>
      <>
        <button
          id="login-btn"
          onclick={() => {
            Ura.navigate("/login");
          }}
        >
          <h4>Login</h4>
        </button>
        <button
          id="signup-btn"
          onclick={() => {
            Ura.navigate("/signup");
          }}
        >
          <h4>Sign up</h4>
        </button>
      </>
    </div>
  ));
}

export default Navbar;
