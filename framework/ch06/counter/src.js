import {
  createApp,
  createElement,
  createFragment,
  Routes,
  State,
  // StateTag,
} from "../lib/mini.js";
/*
TODO:
  + function return component
  + tag for state
  + add render this component whe state change
*/

function View() {
  const states = new State();
  states.setItem("x", 1);

  return (
    <state state={states}>
      <div>
        <button
          onclick={() => {
            states.setItem("x", states.getItem("x") + 1);
          }}
        >
          clique me
        </button>
        <div id="abc">
          <h1>this is {()=> states.getItem("x")}</h1>
        </div>
      </div>
    </state>
  );
}

// console.log(View());
createApp({ viewfunc: <View /> }).mount(document.body);
