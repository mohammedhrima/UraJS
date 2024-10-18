import Ura from "../ura/code.js";

function Text(props) {
  console.log("call Text tag with", props);
  const [state, render] = Ura.init();
  return render(() => (
    <div>
      <h1>ff</h1>
      hey
    </div>
  ))

}

// function Nav() {
//   const [state, render] = Ura.init();
//   const [getter, setter] = state(10);
//   return render(() => (
//     <div>
//       <button onclick={() => {
//         setter(getter() + 1);
//       }}>
//         hello world
//       </button>
//       <Text value={getter()} />
//     </div>
//   ))
// }

function App() {
  const [state, render] = Ura.init();
  return render(() => (
    <root>
      <Text value={11} />
    </root>
  ))
}

Ura.display(<App />);
Ura.sync();
