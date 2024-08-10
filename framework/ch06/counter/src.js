import {
  createApp,
  createElement,
  createFragment,
  State,
} from "../lib/mini.js";

/*
TODO:
  + fix fragement
  + fix functions return components
*/
function Com() {
  const states = new State();
  const component = () => <h1>Comaa</h1>;
  return { states, component };
}

function View() {
  const states = new State();
  states.setItem("x", 1);

  const component = () => (
    <div id="abc">
      <Com />
      <h1>
        {/* <button
          onclick={() => {
            states.setItem("x", states.getItem("x") + 1);
          }}
        >
          clique
        </button> */}
        {/* <br/> */}
        value {states.getItem("x")}
      </h1>
    </div>
  );

  return { states, component };
}

// console.log(View());
createApp({ viewfunc: <View /> }).mount(document.body);
