import Ura from "ura";
import Navbar from "./_utils/Navbar/Navbar.js";

function Child(props) {
  const [render, State] = Ura.init();
  const [getter, setter] = State(20);
  
  return render(() => (
    <fr>
      <h1>child {props.id}</h1>
      <button
        onclick={() => setter(getter() + 1)}
      >
        click {getter()}
      </button>
    </fr>
  ));
}


function Home() {
  const [render, State] = Ura.init();
  const [getter, setter] = State(10);

  return render(() => (
    <div>
      <h1>hello from Home {getter()}</h1>
      <button
        onclick={() => Ura.navigate("/test")}
      >
        click
      </button>
      <Child id={5} />
    </div>
  ));
}

export default Home;
