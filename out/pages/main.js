// Mini.loadCSS("./main.css");
// import Game from "./Game/Game.js";
// import User from "./User/User.js";
import Home from "./Home/Home.js";
// async function navigateToPath(path) {
//   try {
//     // Fetch the script content from the server
//     const response = await fetch(path);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
//     }
//     // Create a new <script> element
//     const scriptElement = document.createElement('script');
//     scriptElement.type = 'module'; // or 'text/javascript' if not an ES module
//     // Set the content of the script
//     const scriptContent = await response.text();
//     scriptElement.textContent = scriptContent;
//     // Append the script to the document
//     document.head.appendChild(scriptElement);
//     // Update the URL without reloading the page
//     const newUrl = new URL(path, window.location.origin).href;
//     history.pushState(null, '', newUrl);
//     console.log('Script loaded and URL updated:', path);
//   } catch (error) {
//     console.error('Error navigating to path:', error);
//   }
// }
// // Example usage
// navigateToPath('/user'); // Uncomment this line to test the function
// console.log("fff");
// function Default() {
//   return { key: null, render: () => <h1>Default</h1> };
// }
// function Test1(props: any) {
//   return { key: null, render: () => <h1>Test 1 with props: {props.id}</h1> };
// }
// function Test2(props: any) {
//   return { key: null, render: () => <h1>Test 2</h1> };
// }
// function Test3(props: any) {
//   return { key: null, render: () => <h1>Test 3 with props: {props.id}</h1> };
// }
// function NavTag() {
//   return {
//     key: null,
//     render: () => {
//       return (
//         <>
//           {/* <navigate to={"/test3/:123"}>navigate to /test3</navigate> */}
//           <navigate to={"/test1"}>navigate to /test1</navigate>
//         </>
//       );
//     },
//   };
// }
// Mini.display(
//   <get by="#root">
//     <route path="/" call={Default} />
//     <route path="/test1" call={Test1} />
//     <route path="/test2" call={Test2} />
//     <route path="/test3/:id" call={Test3} />
//   </get>
// );
// // const match = Mini.matchPath("/test3:id", "/test3:123");
// // console.log("match: ", match);
// const { matchPath, Routes } = Mini;
// Routes["/"] = { call: Default, props: {} };
// Routes["/test1"] = { call: Test1, props: { id: 1 } };
// Routes["/test2"] = { call: Test2, props: {} };
// Routes["/test3/:id"] = { call: Test3, props: {} };
// console.log(matchPath("/:id", "/123")); // Output: { path: "/", props: {} }
// console.log(matchPath("/test3/:id/", "/test3/123")); // Output: { path: "/test3", props: { id: "123" } }
// console.log(matchPath("/test3/:id", "/test3"));
// // Mini.Routes.set("/", Default);
// // Mini.Routes.set("/test1", Test1);
// // Mini.Routes.set("/test2", Test2);
// console.log(Mini.Routes);
// const urlRoutes = {
//   "/": {
//     Template: <get by="#root"><Default/></get>,
//   },
//   "/test1": {
//     Template: <get by="#root"><Test1/></get>,
//   },
//   "/test2": {
//     Template: <get by="#root"><Test2/></get>,
//   },
// };
// const pathToRegex = (path) => {
//   return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
// };
// const getParams = (match) => {
//   console.log(match);
//   const values = match.result.slice(1);
//   const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
//     (result) => result[1]
//   );
//   return Object.fromEntries(
//     keys.map((key, i) => {
//       return [key, values[i]];
//     })
//   );
// };
// const router = async (path) => {
//   let location = path || "/";
//   console.log(path);
//   if (location.length == 0) {
//     location = "/";
//   }
//   const Comp = urlRoutes[location].Template;
//   Mini.display(Comp);
//   // document.getElementById("root").innerHTML = route.template;
// };
// const urlRoute = (event) => {
//   event = event || window.event; // get window.event if event argument not provided
//   event?.preventDefault();
//   // window.history.pushState(state, unused, target link);
//   window.history.pushState({}, "", event.target.href);
//   // console.log(window.location.pathname);
//   router(window.location.pathname);
// };
// document.addEventListener("click", (e) => {
//   const { target } = e;
//   //@ts-ignore
//   if (!target.matches("nav a")) {
//     return;
//   }
//   // console.log("cliqe on nav");
//   e.preventDefault();
//   // @ts-ignore
//   urlRoute(e);
// });
// document.addEventListener("DOMContentLoaded", (event) => {
//   console.log("DOMContentLoaded");
//   //@ts-ignore
//   if (event) urlRoute(event);
// });
// Function to handle navigation between pages
function navigateTo(path) {
    // Change the URL without reloading the page
    history.pushState({}, "", path);
    // Handle the new route by updating the view
    handleRoute();
}
const routes = {
    "/": Home,
    // "/user": User,
    // "/game": Game,
};
// Handle the route based on the current path
function handleRoute() {
    const path = window.location.pathname;
    // If the route exists in the `routes` object, render its content
    const content = routes[path] || "<h1>404 - Page Not Found</h1>";
    // document.getElementById("root").innerHTML = content;
    console.log(content);
}
// Listen to browser back/forward navigation (popstate)
window.addEventListener("popstate", handleRoute);
// Handle initial load or when user refreshes the page
document.addEventListener("DOMContentLoaded", handleRoute);
// Intercept clicks on links to handle them using JavaScript
document.addEventListener("click", (event) => {
    const target = event.target;
    // Check if the clicked element is an anchor link
    //@ts-ignore
    if (target.tagName === "A" && target.href) {
        event.preventDefault(); // Prevent the default link behavior
        //@ts-ignore
        const path = new URL(target.href).pathname;
        navigateTo(path); // Use the custom navigation function
    }
});
