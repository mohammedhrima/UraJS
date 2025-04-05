/*
 * Routing Schema
 * Each route is an object with the following structure:
 * {
 *   "/pathname": Component,      
 *    // key is The URL path for the route
 *    // '*' is for default route, will be redirected to if navigate
 *    // Component: the component that will be displayed
 * }
 *
 * Example:
 * {
 *    "/home": Home,
 *    "/user": User,
 *    "/user/setting": Setting
 * }
 */

import Ura from "ura";


Ura.setRoutes({
});

Ura.setStyles([
  "./pages/home/home.css",
  "./pages/main.css",
  "./components/list.css",
  "./components/navbar.css"
]);

Ura.start();