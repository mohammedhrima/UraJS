function _define_property(obj, key, value) {
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
import { Mini } from "../../../Mini/lib.js";
function User() {
    const Go = (e)=>{
        
        Mini.Navigate("/login", "Go function");
    
    };
    return  Mini.createElement(Mini.Src, {
        name: "user"
    },  Mini.createElement("div", {
        className: "info"
    },  Mini.createElement("img", {
        src: "assets/images/001.svg"
    }),  Mini.createElement("div", {
        className: "infos"
    },  Mini.createElement("h2", null, "Mohammed hrima"),  Mini.createElement("button", {
        onclick: (e)=>Go(e)
    }, "Clique me"))));
}
function History() {
    return  Mini.createElement("div", {
        className: "history"
    },  Mini.createElement("h3", null, "vs "),  Mini.createElement("img", {
        src: "assets/images/001.png"
    }),  Mini.createElement("h3", null, "User_name"),  Mini.createElement("h3", null, "17:05"),  Mini.createElement("span", null));
}
function Play({ path }) {
    const hover = new Mini.Variable(false);
    const styling = new Mini.Variable({
        position: "absolute",
        visibility: "hidden"
    });
    const setHover = ()=>{
        
        hover.value = !hover.value;
        if (hover.value) styling.value = _object_spread_props(_object_spread({}, styling.value), {
            visibility: "visible"
        });
        else styling.value = _object_spread_props(_object_spread({}, styling.value), {
            visibility: "hidden"
        });
    
    };
    return  Mini.createElement("div", {
        className: "play_game",
        onmouseover: setHover,
        onmouseout: setHover
    },  Mini.createElement("img", {
        src: path,
        loading: "lazy",
        style: {
            width: "100%",
            borderRadius: "10px",
            minWidth: "100px",
            transition: "filter 0.35s ease"
        }
    }),  Mini.createElement("h2", {
        style: styling
    }, "Play"));
}
function Game({ UserLevel }) {
    const styling = new Mini.Variable({
        backgroundColor: "blue"
    });
    return  Mini.createElement(Mini.Src, {
        name: "game"
    },  Mini.createElement("div", {
        className: "infos"
    },  Mini.createElement("div", {
        className: "box"
    },  Mini.createElement("div", {
        className: "perecent"
    },  Mini.createElement("svg", {
        style: {
            width: "150px",
            height: "150px"
        }
    },  Mini.createElement("circle", {
        cx: "70",
        cy: "70",
        r: "70"
    }),  Mini.createElement("circle", {
        cx: "70",
        cy: "70",
        r: "70",
        style: {
            strokeDashoffset: `calc(440 - (440 * ${UserLevel}) / 100)`
        }
    })),  Mini.createElement("div", {
        className: "number"
    },  Mini.createElement("h2", null, UserLevel,  Mini.createElement("span", null, "%"))))),  Mini.createElement("div", {
        className: "histories"
    },  Mini.createElement("h2", null, "History"),  Mini.createElement("div", {
        className: "table"
    },  Mini.createElement(History, null),  Mini.createElement(History, null)))),  Mini.createElement("div", {
        className: "play"
    },  Mini.createElement(Play, {
        path: "assets/images/001.png"
    }),  Mini.createElement(Play, {
        path: "assets/images/002.png"
    }),  Mini.createElement(Play, {
        path: "assets/images/003.png"
    })));
}
function Chat() {
    return  Mini.createElement(Mini.Src, {
        name: "chat"
    },  Mini.createElement("div", {
        className: "chat_info"
    }, "this div 3"));
}
const Components = [
     Mini.createElement(User, null),
     Mini.createElement(Game, {
        UserLevel: 60
    }),
     Mini.createElement(Chat, null)
];
Components.forEach((Comp)=>{
    Mini.render(Comp);
});
