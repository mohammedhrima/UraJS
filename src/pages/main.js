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
  
import Home from "./home/home.js";
import User from "./user/user.js";
  
Ura.setRoutes({
  "*": Home,
  "/home": Home,
  "/user": User
});
  
Ura.setStyles([
  "/pages/home/home.css",
  "/pages/main.css",
  "/pages/user/user.css"
]);
  
Ura.start();