// TODO: keep it, update it later using routes
// TODO: render the html page in server.js file as string

import { Mini } from "../Mini/lib.js";

Mini.setRoutes({
  "": "/pages/Home/home.html",
  home: "/pages/Home/home.html",
  test: "/pages/Test/test.html",
  login: "/pages/Login/login.html",
});

