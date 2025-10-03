import { checkConfig, setConfig } from "./utils.js";

(async (): Promise<void> => {
    setConfig({})
    await checkConfig();
})()
