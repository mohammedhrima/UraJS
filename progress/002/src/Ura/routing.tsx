import Ura from "./code.js";
import { VDOM } from "./types.js";
import * as UTILS from "./utils.js";

export const Routes: { [path: string]: Function } = {};
export let mini_root: VDOM = null;

function normalizePath(path: string) {
  if (!path || path == "") return "/";
  // console.log(typeof path);
  path = path.replace(/^\s+|\s+$/gm, "");
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/{2,}/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

export function refresh() {
  let hash = window.location.hash.slice(1) || "/";
  hash = normalizePath(hash);
  /*
  TODO:
  + in case '*' check if it's error Component if so give it the path as parameter
  + I did <RoutConfig/> because I need the key attribute
  + refresh without reconcilation
  + refresh with reconcilation
  */
  const RouteConfig = Routes[hash] || Routes["*"];
  console.log("call refresh: ", hash);
  console.log("old:", mini_root);
  if (mini_root) {
    console.log("EXISTING");
    Ura.reconciliate(mini_root, <RouteConfig />);
  } else {
    mini_root = Ura.execute(UTILS.CREATE, <RouteConfig />);
  }
}

export const navigate = (route, params = {}) => {
  // console.log("call navigate");
  route = route.split("?")[0];
  route = normalizePath(route);
  window.history.pushState({}, "", `#${route}`);
  refresh();
};