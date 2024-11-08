import Ura from "ura";
import dir_routes from "./routes.js";
Ura.sync();
async function loadRoutes(dir_routes) {
    //@ts-ignore
    for (let i = 0; i < dir_routes.length; i++) {
        //@ts-ignore
        let { path, from, css, base } = dir_routes[i];
        if (!path || !from)
            throw "path and from are required, check routes.js file";
        const module = await import(from);
        if (!module.default)
            throw `${path}: ${from} must have a default export`;
        path = Ura.normalizePath(path);
        Ura.setRoute(path, module.default);
        if (base)
            Ura.setRoute("*", module.default);
        if (css)
            Ura.loadCSS("./pages/" + css);
    }
    window.addEventListener("hashchange", Ura.refresh);
    window.addEventListener("DOMContentLoaded", Ura.refresh);
    window.addEventListener("popstate", Ura.refresh);
    Ura.refresh();
}
try {
    loadRoutes(dir_routes);
}
catch (error) {
    console.error(error);
}
