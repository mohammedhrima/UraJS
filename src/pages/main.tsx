import Mini from "../mini/mini.js";
import Routes from "./routes.js";

// Load CSS
Mini.loadCSS("pages/main.css");

const importComponent = async (path: string) => {
  try {
    const module = await import(`${path}`);
    return module.default;
  } catch (error) {
    console.error(`Error importing component at ${path}:`, error);
    return null;
  }
};

const logAndImportRoute = async (prefix: string, route: any, path: any) => {
  const fullPath = `${prefix}${route.filename}`;
  const Component = await importComponent(fullPath);
  if (Component) {
    Mini.Routes["/" + path] = Component;
    if (route.default) Mini.Routes["*"] = Component;
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
};

const setupRoutes = async () => {
  const routePromises = [];

  Object.keys(Routes).forEach((key) => {
    const route = Routes[key];
    routePromises.push(logAndImportRoute(`./${route.dir}/`, route, key));
  });

  await Promise.all(routePromises);
  console.log("All routes have been set up:");
  console.log(Mini.Routes);
};

setupRoutes()
  .then(() => {
    console.log("Routes initialization completed.");
  })
  .then(() => {
    window.addEventListener("hashchange", Mini.refresh);
    window.addEventListener("DOMContentLoaded", Mini.refresh);
    Mini.refresh();
  });