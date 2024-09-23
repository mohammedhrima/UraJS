import Mino from "./code.js";
import { Error } from "./utils.js";
export const Routes = {};
Routes["*"] = Error;
export let root = null;
export function setRoot(new_root) {
    root = new_root;
}
export function normalizePath(path) {
    if (!path || path == "")
        return "/";
    // console.log(typeof path);
    path = path.replace(/^\s+|\s+$/gm, "");
    if (!path.startsWith("/"))
        path = "/" + path;
    path = path.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/"))
        path = path.slice(0, -1);
    return path;
}
export function refresh() {
    let hash = window.location.hash.slice(1) || "/";
    hash = normalizePath(hash);
    /*
    | TODO:
    | in case '*' check if it's error Component
    | if so give it the path as parameter
    */
    const RouteConfig = Routes[hash] || Routes["*"];
    /*
    | I did <RoutConfig/> because
    | I need the key attribute
    */
    // Mino.display(
    //   <root>
    //     <RouteConfig />
    //   </root>
    // );
    Mino.display(Mino.element(RouteConfig, null));
    // console.log(root);
}
export const navigate = (route, params = {}) => {
    // console.log("call navigate");
    route = route.split("?")[0];
    route = normalizePath(route);
    window.history.pushState({}, "", `#${route}`);
    const RouteConfig = Routes[route] || Routes["*"];
    //@ts-ignore
    // Mino.display(
    //   <root>
    //     <RouteConfig />
    //   </root>
    // );
    Mino.display(Mino.element(RouteConfig, null));
    console.log(root);
};
