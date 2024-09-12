"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_js_1 = require("../../mini/mini.js");
mini_js_1.default.loadCSS("src-js/pages/Test/Test.css");
function Test() {
    var _a = mini_js_1.default.initState(), key = _a[0], state = _a[1];
    return {
        key: key,
        component: function () {
            return <div>Test</div>;
        },
    };
}
exports.default = Test;
