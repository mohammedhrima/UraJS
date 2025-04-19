import { checkConfig, setConfig } from "./scripts/utils.js";

export default (async () => {
  setConfig({
    typescript: "disable",
    dirRouting: "enable",
    defaultRoute: "home",
    tailwind: "disable",
    scss: "disable",
    css: "enable",
    port: 17000,
  })
  await checkConfig();
})
