import Mini from "../mini/mini.js";
import Routes from "./routes.js";
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
        Mini.Routes["/" + path] = Component;
        if (route.default)
            Mini.Routes["*"] = Component;
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
setupRoutes()
    .then(() => {
    console.log("Routes initialization completed.");
})
    .then(() => {
    window.addEventListener("hashchange", Mini.refresh);
    window.addEventListener("DOMContentLoaded", Mini.refresh);
    Mini.refresh();
});
// const parent = document.getElementById("root");
// // Create a temporary container (an alternative to DocumentFragment)
// const container = document.createElement("div");
// // Add multiple elements to the container
// for (let i = 0; i < 3; i++) {
//   const newElement = document.createElement("li");
//   newElement.textContent = `New Item ${i + 1}`;
//   container.appendChild(newElement);
// }
// // Move all children from container to the parent element
// while (container.firstChild) {
//   console.log(container);
//   parent.appendChild(container.firstChild);
// }
// function replaceChildAt(parentElement, index, newElement) {
//   const children = parentElement.children;
//   if (index >= 0 && index < children.length) {
//     // Replace the child at the given index
//     parentElement.replaceChild(newElement, children[index]);
//   } else {
//     console.error("Index out of bounds");
//   }
// }
// // Example usage:
// const parent = document.getElementById("root");
// parent.appendChild(document.createElement("div"));
// parent.appendChild(document.createElement("div"));
// parent.appendChild(document.createElement("div"));
// const newElement = document.createElement("span");
// newElement.textContent = "This is the new element";
// // Replace the child at index 1
// replaceChildAt(parent, 1, newElement);
