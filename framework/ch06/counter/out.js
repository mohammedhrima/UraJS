import { createApp, createElement, createFragment, Routes, State } from "../lib/mini.js";
 function View() {
    const states = new State();
    states.setItem("x", 1);
    return  createElement("state", {
        state: states
    },  createElement("div", null,  createElement("button", {
        onclick: ()=>{
            states.setItem("x", states.getItem("x") + 1);
        }
    }, "clique me"),  createElement("div", {
        id: "abc"
    },  createElement("h1", null, "this is ", ()=>states.getItem("x")))));
}

createApp({
    viewfunc:  createElement(View, null)
}).mount(document.body);
