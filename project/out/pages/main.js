import Ura from "../ura/code.js";
function Text(props) {
    console.log("call Text tag with", props);
    const [state, render] = Ura.init();
    return render(() => (Ura.element("div", null,
        Ura.element("h1", null, "ff"),
        "hey")));
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
    return render(() => (Ura.element("root", null,
        Ura.element(Text, { value: 11 }))));
}
Ura.display(Ura.element(App, null));
Ura.sync();
