import Ura from "ura";
import Navbar from "../utils/Navbar/Navbar.jsx";
import Arrow from "../utils/Arrow/Arrow.jsx";

function Login() {
  const [render, State] = Ura.init();
  const [getCheck, setCheck] = State(true);

  const checkbox = (e) => {
    e.preventDefault();
    setCheck(e.target.checked);
  };
  return render(() => (
    <div className="login">
      <div id="top">
        <Navbar />
      </div>
      <div id="center">
        <div id="card">
          <h3 id="title">Login</h3>
          <div id="input-section">
            <input type="text" id="usernmae" placeholder={"Username"} />
            <input type="password" id="password" placeholder={"Password"} />
            <div id="checkbox">
              <label>
                <input type="checkbox" onChange={checkbox} />
                Remember me
              </label>
            </div>
          </div>
          <div id={"button-section"}>
            <button id={"btn"}>
              {/* <img src="/assets/arrow.svg" alt="" /> */}
              <Arrow />
            </button>
          </div>
          <h4
            id="signin"
            onclick={() => {
              Ura.navigate("/signup");
            }}
          >
            Don't have an account ?
          </h4>
        </div>
      </div>
    </div>
  ));
}

export default Login;
