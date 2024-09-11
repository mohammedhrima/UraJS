import Mini from "./mini/mini.js";
import "./routes.js";
Mini.loadCSS("./src-js/main.css");
function Default() {
    return {
        key: null,
        component: () => {
            return (Mini.element(Mini.fragment, null,
                Mini.element(NavTag, null),
                Mini.element("h1", null, "default")));
        },
    };
}
function Test1() {
    return {
        key: null,
        component: () => {
            return Mini.element("h1", null, "Test 1");
        },
    };
}
function Test2() {
    return {
        key: null,
        component: () => {
            return Mini.element("h1", null, "Test 2");
        },
    };
}
function NavTag() {
    return {
        key: null,
        component: () => {
            return Mini.element("navigate", { to: "/test1" }, "navigate to test1");
        },
    };
}
Mini.display(Mini.element("get", { by: "#root" },
    Mini.element("route", { path: "/", call: Default }),
    Mini.element("route", { path: "/test1", call: Test1 }),
    Mini.element("route", { path: "/test2", call: Test2 })));
console.log(Mini.Routes);
// const urlRoutes = {
//   "/": {
//     Template: <get by="#root"><Default/></get>,
//   },
//   "/test1": {
//     Template: <get by="#root"><Test1/></get>,
//   },
//   "/test2": {
//     Template: <get by="#root"><Test2/></get>,
//   },
// };
// const pathToRegex = (path) => {
//   return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
// };
// const getParams = (match) => {
//   console.log(match);
//   const values = match.result.slice(1);
//   const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
//     (result) => result[1]
//   );
//   return Object.fromEntries(
//     keys.map((key, i) => {
//       return [key, values[i]];
//     })
//   );
// };
// const router = async (path) => {
//   let location = path || "/";
//   console.log(path);
//   if (location.length == 0) {
//     location = "/";
//   }
//   const Comp = urlRoutes[location].Template;
//   Mini.display(Comp);
//   // document.getElementById("root").innerHTML = route.template;
// };
// const urlRoute = (event) => {
//   event = event || window.event; // get window.event if event argument not provided
//   event?.preventDefault();
//   // window.history.pushState(state, unused, target link);
//   window.history.pushState({}, "", event.target.href);
//   // console.log(window.location.pathname);
//   router(window.location.pathname);
// };
// document.addEventListener("click", (e) => {
//   const { target } = e;
//   //@ts-ignore
//   if (!target.matches("nav a")) {
//     return;
//   }
//   // console.log("cliqe on nav");
//   e.preventDefault();
//   // @ts-ignore
//   urlRoute(e);
// });
// document.addEventListener("DOMContentLoaded", (event) => {
//   console.log("DOMContentLoaded");
//   //@ts-ignore
//   if (event) urlRoute(event);
// });
