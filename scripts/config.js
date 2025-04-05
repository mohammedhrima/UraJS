import { checkConfig, setConfig } from "./utils.js";

(async () => {
    setConfig({})
    await checkConfig();
})()