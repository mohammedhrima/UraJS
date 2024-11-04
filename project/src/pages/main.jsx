import Ura from "ura";
import Routes from "./routes.js";
Ura.sync();

// function Text(props) {
//   console.log("call Text tag with", props);
//   const [state, render] = Ura.init();
//   return render(() => (
//     <container>
//       <h1>value {props.value}</h1>
//     </container>
//   ))

// }

// function Nav() {
//   const [state, render] = Ura.init();
//   const [getter, setter] = state(10);
//   return render(() => (
//     <div>
//       <button onclick={() => {
//         setter(getter() + 1);
//       }}>
//         hello world {getter()}
//       </button>
//       <Text value={getter()} />
//       <Text value={5}/>
//     </div>
//   ))
// }

// function App() {
//   const [state, render] = Ura.init();
//   return render(() => (
//     <root>
//       <Nav/>
//     </root>
//   ))
// }

// Ura.display(<App />);

console.log("hello");

function normalizePath(path) {
  if (!path || path == "") return "/";
  path = path.replace(/^\s+|\s+$/gm, "");
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

function refresh() {
  console.log("call refresh");

  let hash = window.location.hash.slice(1) || "/";
  hash = normalizePath(hash);
  const RouteConfig = Ura.getRoute(hash);
  console.log("go to", RouteConfig);
}

async function loadRoutes() {
  for (let i = 0; i < Routes.length; i++) {
    let { path, from, subs, base } = Routes[i];
    if (!path || !from)
      throw "path and from are required, check routes.js file"
    const module = await import(from);
    if (!module.default)
      throw `${path}: ${from} must have a default export`
    path = normalizePath(path);
    Ura.setRoute(path, module.default)
    if (base)
      Ura.setRoute("*", module.default);
  }
  window.addEventListener("hashchange", refresh);
  window.addEventListener("DOMContentLoaded", refresh);
  window.addEventListener("popstate", refresh);
  refresh();
}

try {
  loadRoutes()
} catch (error) {
  console.error(error);
}