import Mino from "./code.js";
import { CREATE } from "./utils.js";
export const Routes = {};
export let mini_root = null;
export function setRoot(new_root) {
    mini_root = new_root;
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
    console.log("call refresh");
    console.log("old", mini_root);
    console.log("new", Mino.element("root", null,
        Mino.element(RouteConfig, null)));
    /*
    TODO:
      + refresh without reconcilation
      + refresh with reconcilation
    */
    if (mini_root) {
        Mino.reconciliate(mini_root, Mino.element("root", null,
            Mino.element(RouteConfig, null)));
    }
    else {
        mini_root = Mino.execute(CREATE, Mino.element("root", null,
            Mino.element(RouteConfig, null)));
    }
}
export const navigate = (route, params = {}) => {
    // console.log("call navigate");
    route = route.split("?")[0];
    route = normalizePath(route);
    window.history.pushState({}, "", `#${route}`);
    const RouteConfig = Routes[route] || Routes["*"];
    // Mino.display(<RouteConfig />);
    //@ts-ignore
    // Mino.display(
    //   <root>
    //     <RouteConfig />
    //   </root>
    // );
    // console.log(mini_root);
};
