import Mini from "./mini/mini.js";
import "./routes.js";
import { MiniComponent } from "./mini/types.js";
Mini.loadCSS("./src-js/main.css");

function Default() {
  return {
    key: null,
    component: () => {
      return (
        <>
          <NavTag />
          <h1>default</h1>
        </>
      );
    },
  };
}

function Test1(): MiniComponent {
  return {
    key: null,
    component: () => {
      return <h1>Test 1</h1>;
    },
  };
}

function Test2(): MiniComponent {
  return {
    key: null,
    component: () => {
      return <h1>Test 2</h1>;
    },
  };
}

function NavTag() {
  return {
    key: null,
    component: () => {
      return <navigate to={"/test1"}>navigate to test1</navigate>;
    },
  };
}

Mini.display(
  <get by="#root">
    <route path="/" call={Default} />
    <route path="/test1" call={Test1} />
    <route path="/test2" call={Test2} />
  </get>
);

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
