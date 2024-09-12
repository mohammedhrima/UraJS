"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_js_1 = require("../../mini/mini.js");
mini_js_1.default.loadCSS("src-js/pages/Home/Home.css");
function Home(props) {
    var _a = mini_js_1.default.initState(), key = _a[0], state = _a[1];
    var _b = state(0), setValue = _b[0], getValue = _b[1];
    return {
        key: key,
        component: function () {
            return (<>
          <div id={"home"}>Mini Js</div>
        </>);
        },
    };
}
exports.default = Home;
