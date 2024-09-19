import Mini from "../mini/mini.js";
import Routes from "./routes.json" with { type: "json" };
// Load CSS
Mini.loadCSS("pages/main.css");
async function importComponent(path) {
    try {
        const module = await import(`${path}`);
        return module.default;
    }
    catch (error) {
        console.error(`Error importing component at ${path}:`, error);
        return null;
    }
}
async function logAndImportRoute(prefix, route, path) {
    const fullPath = `${prefix}${route.filename}`;
    const Component = await importComponent(fullPath);
    if (Component) {
        let tag = Component;
        // console.log("from main", tag);
        Mini.Routes["/" + path] = tag;
        if (route.default) {
            console.log("found default");
            Mini.Routes["*"] = tag;
        }
    }
    if (route.subpaths) {
        for (const subpath of Object.keys(route.subpaths)) {
            await logAndImportRoute(`./${route.subpaths[subpath].dir}/`, route.subpaths[subpath], path + "/" + subpath);
        }
    }
}
async function setupRoutes() {
    const routePromises = [];
    Object.keys(Routes).forEach((key) => {
        const route = Routes[key];
        routePromises.push(logAndImportRoute(`./${route.dir}/`, route, key));
    });
    await Promise.all(routePromises);
}
setupRoutes().then(() => {
    console.log("Routes initialization completed.");
}).then(() => {
    window.addEventListener("hashchange", Mini.refresh);
    window.addEventListener("DOMContentLoaded", Mini.refresh);
    Mini.refresh();
});
console.log(Mini.Routes);
