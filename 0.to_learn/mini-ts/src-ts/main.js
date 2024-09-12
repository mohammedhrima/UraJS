"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_js_1 = require("./mini/mini.js");
var Home_js_1 = require("./pages/Home/Home.js");
mini_js_1.default.loadCSS("./src-js/main.css");
function Test1() {
    return {
        key: null,
        component: function () {
            return (<h1>test 1</h1>);
        },
    };
}
function Test2() {
    return {
        key: null,
        component: function () {
            return <h1>test2</h1>;
        },
    };
}
mini_js_1.default.display(<get by="#root">
    <mini_js_1.default.Routes path="/" call={<Home_js_1.default />}/>
    {/* <Mini.Routes path="/" call={<Test1/>} /> */}
  </get>);
