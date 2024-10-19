import Ura from "../ura/code.js";

function Text(props) {
  console.log("call Text tag with", props);
  const [state, render] = Ura.init();
  return render(() => (
    <fr>
      <h1>value {props.value}</h1>
    </fr>
  ))

}

function Nav() {
  const [state, render] = Ura.init();
  const [getter, setter] = state(10);
  return render(() => (
    <div>
      <button onclick={() => {
        setter(getter() + 1);
      }}>
        hello world
      </button>
      <Text value={getter()} />
    </div>
  ))
}

function App() {
  const [state, render] = Ura.init();
  return render(() => (
    <root>
      <Nav/>
    </root>
  ))
}

Ura.display(<App />);
Ura.sync();
