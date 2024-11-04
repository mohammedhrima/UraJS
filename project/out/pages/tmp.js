// // import Mino from "../Ura/code.js";
// // import LoadedRoutes from "./routes.json" with { type: "json" };
// // Mino.loadCSS("pages/main.css");
// // async function importComponent(path: string) {
// //   try {
// //     const module = await import(`${path}`);
// //     return module.default;
// //   } catch (error) {
// //     console.error(`Error importing component at ${path}:`, error);
// //     return null;
// //   }
// // }
// // async function SetRoutes(prefix: string, route: any, path: any) {
// //   const fullPath = `${prefix}${route.filename}`;
// //   const Component = await importComponent(fullPath);
// //   if (Component) {
// //     let tag = Component;
// //     Mino.Routes["/" + path] = tag;
// //     if (route.default) Mino.Routes["*"] = tag;
// //   }
// //   if (route.subpaths) {
// //     for (const subpath of Object.keys(route.subpaths)) {
// //       await SetRoutes(
// //         `./${route.subpaths[subpath].dir}/`,
// //         route.subpaths[subpath],
// //         path + "/" + subpath
// //       );
// //     }
// //   }
// // }
// // async function setupRoutes() {
// //   const routePromises = [];
// //   Object.keys(LoadedRoutes).forEach((key) => {
// //     const route = LoadedRoutes[key];
// //     routePromises.push(SetRoutes(`./${route.dir}/`, route, key));
// //   });
// //   await Promise.all(routePromises);
// // }
// // setupRoutes()
// //   .then(() => {
// //     console.log("LoadedRoutes initialization completed.");
// //     window.addEventListener("hashchange", Mino.refresh);
// //     window.addEventListener("DOMContentLoaded", Mino.refresh);
// //     window.addEventListener("popstate", Mino.refresh);
// //     Mino.refresh();
// // console.log(Mino.Routes);
// //   });
// // const ws = new WebSocket(`ws://${window.location.host}`);
// // console.log(window.location.host);
// // ws.onmessage = (event) => {
// //   if (event.data === "mini-reload") {
// //     console.log("reload page");
// //     window.location.reload();
// //   }
// // };
// // ws.onopen = () => {
// //   console.log("WebSocket connection established");
// // };
// // ws.onerror = (error) => {
// //   console.error("WebSocket error:", error);
// // };
// // ws.onclose = () => {
// //   console.log("WebSocket connection closed");
// // };
