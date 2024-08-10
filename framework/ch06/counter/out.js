import { createApp, createElement, createFragment, State } from "../lib/mini.js";
 function Com() {
    const states = new State();
    const component = ()=> createElement("h1", null, "Comaa");
    return {
        states,
        component
    };
}
function View() {
    const states = new State();
    states.setItem("x", 1);
    const component = ()=> createElement("div", {
            id: "abc"
        },  createElement(Com, null),  createElement("h1", null, "value ", states.getItem("x")));
    return {
        states,
        component
    };
}

createApp({
    viewfunc:  createElement(View, null)
}).mount(document.body);
