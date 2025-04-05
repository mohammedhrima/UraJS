import { checkConfig, setConfig } from "./scripts/utils.js";

(async()=>{
  await setConfig({
    typescript: "enable",
    dirRouting: "enable",
    defaultRoute: "home",
    tailwinds: "enable",
    scss: "enable",
    port: 17000,
  })
  await checkConfig();
})()