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
 * const Routes = {
 *    "/home": Home,
 *    "/user": User,
 *    "/user/setting": Setting
 * }
 */

import Ura from "ura";

import home from "./home/home.js";
import user from "./user/user.js";

Ura.setRoutes({
  "*": home,
  "/home": home,
  "/user": user
});

Ura.setStyles([
  "./pages/home/home.css",
  "./pages/main.css",
  "./components/list.css",
  "./components/navbar.css"
]);

Ura.start();