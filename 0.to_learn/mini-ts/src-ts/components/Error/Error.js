"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mini_js_1 = require("../../mini/mini.js");
mini_js_1.default.loadCSS("src-js/components/Error/Error.css");
function Error(props) {
    return {
        key: null,
        component: function () {
            return (<mini_js_1.default.get by="#root">
          <h4 style={{
                    fontFamily: "sans-serif",
                    fontSize: "10vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}>
            Error:{props && props["message"] ? props["message"] : ""} Not Found
          </h4>
        </mini_js_1.default.get>);
        },
    };
}
exports.default = Error;
