import Mino from "../Minotaur/code.js";
import Routes from "./routes.json" with { type: "json" };

// Load CSS
Mino.loadCSS("pages/main.css");

async function importComponent(path: string) {
  try {
    const module = await import(`${path}`);
    return module.default;
  } catch (error) {
    console.error(`Error importing component at ${path}:`, error);
    return null;
  }
}

async function logAndImportRoute(prefix: string, route: any, path: any) {
  const fullPath = `${prefix}${route.filename}`;
  const Component = await importComponent(fullPath);
  if (Component) {
    let tag = Component;
    Mino.Routes["/" + path] = tag;
    if (route.default) Mino.Routes["*"] = tag;
    
  }

  if (route.subpaths) {
    for (const subpath of Object.keys(route.subpaths)) {
      await logAndImportRoute(
        `./${route.subpaths[subpath].dir}/`,
        route.subpaths[subpath],
        path + "/" + subpath
      );
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
  }).then(()=>{
    window.addEventListener("hashchange", Mino.refresh);
    window.addEventListener("DOMContentLoaded", Mino.refresh);
    Mino.refresh();
  })

console.log(Mino.Routes);
  