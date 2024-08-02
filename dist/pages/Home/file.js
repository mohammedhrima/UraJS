/** @jsx Mini.createElement */ /** @jsxFrag Mini.Fragment */ import Mini from "./../../../Mini/lib.js";
// var Mini = window.Mini;
function Component() {
    return /*#__PURE__*/ Mini.createElement("div", null, "my Component");
}
// console.log(window.Mini);
Mini.render(/*#__PURE__*/ Mini.createElement(Component, null), document.querySelector('[data-tag="value"]'));
