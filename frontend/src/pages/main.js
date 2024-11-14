import Ura from "ura";
// import dir_routes from "./routes.js";

async function loadRoutes() {
  try {
    const response = await fetch("/pages/routes.json");

    const data = await response.json();
    const { routes, styles, base, type } = data;

    if (routes) {
      for (const route of Object.keys(routes)) {
        const module = await import(routes[route]);
        if (!module.default)
          throw `${route}: ${routes[route]} must have a default export`;
        Ura.setRoute(Ura.normalizePath(route), module.default);
        if (base && route === base) Ura.setRoute("*", module.default);
      }
    }

    // Load CSS styles
    styles?.forEach((style) => {
      Ura.loadCSS("/pages/" + style);
    });

    window.addEventListener("hashchange", Ura.refresh);
    window.addEventListener("DOMContentLoaded", Ura.refresh);
    window.addEventListener("popstate", Ura.refresh);

    Ura.refresh();
    console.log(data);
    console.log(Ura.Routes);

    if (type === "dev") Ura.sync();
  } catch (error) {
    console.error("Error loading JSON or importing modules:", error);
  }
}

loadRoutes();

