/** @jsx Mini.createElement */ /** @jsxFrag Mini.Fragment */ function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
import Mini from "../../../Mini/lib.js";
import Login from "../Login/login.js";
import Navbar from "../_utils/Navbar/navbar.js";
// import Avatar from "../_utils/Images/001.svg";
import game1 from "../_utils/Images/001.png";
import game2 from "../_utils/Images/002.png";
import game3 from "../_utils/Images/003.png";
import styled from "styled-components";
import "./home.css";
function User() {
    return /*#__PURE__*/ Mini.createElement("div", {
        className: "user"
    }, /*#__PURE__*/ Mini.createElement("div", {
        className: "info"
    }, /*#__PURE__*/ Mini.createElement("div", {
        className: "infos"
    }, /*#__PURE__*/ Mini.createElement("h2", null, "Mohammed hrima"))));
}
function History() {
    return /*#__PURE__*/ Mini.createElement("div", {
        className: "history"
    }, /*#__PURE__*/ Mini.createElement("h3", null, "vs "), /*#__PURE__*/ Mini.createElement("img", {
        src: game1
    }), /*#__PURE__*/ Mini.createElement("h3", null, "User_name"), /*#__PURE__*/ Mini.createElement("h3", null, "17:05"), /*#__PURE__*/ Mini.createElement("span", null));
}
function Play(param) {
    var path = param.path;
    var hover = new Mini.Variable(false);
    var styling = new Mini.Variable({
        position: "absolute",
        visibility: "hidden"
    });
    var setHover = function() {
        console.log("set hover to ", !hover.value);
        hover.value = !hover.value;
        if (hover.value) styling.value = _object_spread_props(_object_spread({}, styling.value), {
            visibility: "visible"
        });
        else styling.value = _object_spread_props(_object_spread({}, styling.value), {
            visibility: "hidden"
        });
        console.log(styling.value);
    };
    return /*#__PURE__*/ Mini.createElement("div", {
        className: "play_game",
        onmouseover: setHover,
        onmouseout: setHover
    }, /*#__PURE__*/ Mini.createElement("img", {
        src: path,
        loading: "lazy",
        style: {
            width: "100%",
            borderRadius: "10px",
            minWidth: "100px",
            transition: "filter 0.35s ease"
        }
    }), /*#__PURE__*/ Mini.createElement("h2", {
        style: styling
    }, "Play"));
}
function Game(param) {
    var UserLevel = param.UserLevel;
    var styling = new Mini.Variable({
        backgroundColor: "blue"
    });
    return /*#__PURE__*/ Mini.createElement("div", {
        className: "game",
        style: styling
    }, /*#__PURE__*/ Mini.createElement("div", {
        className: "infos"
    }, /*#__PURE__*/ Mini.createElement("div", {
        className: "box"
    }, /*#__PURE__*/ Mini.createElement("div", {
        className: "perecent"
    }, /*#__PURE__*/ Mini.createElement("svg", {
        style: {
            width: "150px",
            height: "150px"
        }
    }, /*#__PURE__*/ Mini.createElement("circle", {
        cx: "70",
        cy: "70",
        r: "70"
    }), /*#__PURE__*/ Mini.createElement("circle", {
        cx: "70",
        cy: "70",
        r: "70",
        style: {
            strokeDashoffset: "calc(440 - (440 * ".concat(UserLevel, ") / 100)")
        }
    })), /*#__PURE__*/ Mini.createElement("div", {
        className: "number"
    }, /*#__PURE__*/ Mini.createElement("h2", null, UserLevel, /*#__PURE__*/ Mini.createElement("span", null, "%"))))), /*#__PURE__*/ Mini.createElement("div", {
        className: "histories"
    }, /*#__PURE__*/ Mini.createElement("h2", null, "History"), /*#__PURE__*/ Mini.createElement("div", {
        className: "table"
    }, /*#__PURE__*/ Mini.createElement(History, null), /*#__PURE__*/ Mini.createElement(History, null)))), /*#__PURE__*/ Mini.createElement("div", {
        className: "play"
    }, /*#__PURE__*/ Mini.createElement(Play, {
        path: game1
    }), /*#__PURE__*/ Mini.createElement(Play, {
        path: game2
    }), /*#__PURE__*/ Mini.createElement(Play, {
        path: game3
    })));
}
function Chat() {
    return /*#__PURE__*/ Mini.createElement("div", {
        className: "chat"
    }, /*#__PURE__*/ Mini.createElement("div", {
        className: "chat_info"
    }, "this div 3"));
}
function Home() {
    return /*#__PURE__*/ Mini.createElement("div", {
        id: "home"
    }, /*#__PURE__*/ Mini.createElement(Navbar, null), /*#__PURE__*/ Mini.createElement("div", {
        className: "components"
    }, /*#__PURE__*/ Mini.createElement(User, null), /*#__PURE__*/ Mini.createElement(Game, {
        UserLevel: 60
    }), /*#__PURE__*/ Mini.createElement(Chat, null)));
}
export default Home;
