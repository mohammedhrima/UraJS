/** @jsx Mini.createElement */
/** @jsxFrag Mini.Fragment */

import Mini from "./../../../Mini/lib.js"
// var Mini = window.Mini;
function Component() {
    return <div>my Component</div>;
}
// console.log(window.Mini);
Mini.render(<Component />, document.querySelector('[data-tag="value"]'), )

