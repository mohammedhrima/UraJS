import Ura from "ura";
import Navbar from "../utils/Navbar/Navbar.js";

function Home() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(0);

  return render(() => (
    <div className="home">
      <div id="top">
        <Navbar />
      </div>
      <div id="center">
        <h1>
          Join Your <b>Friends</b>
        </h1>
        <h1>and</h1>
        <h1>
          <o>Beat</o> them
        </h1>
      </div>
      <div id="bottom">
        <button>
          <h3>Enter the Arena</h3>
        </button>
      </div>
    </div>
  ));
}

export default Home;
