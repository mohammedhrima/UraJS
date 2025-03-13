import { setConfig } from "./scripts/utils.js";

setConfig({
  dirRouting: true,
  defaultRoute: "/home", /* will be used only if dirRouting is true */
  port: 17000,
  serverTiming: 1,
  style: "css",
  ext: "jsx"
})
