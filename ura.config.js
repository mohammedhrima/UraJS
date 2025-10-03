import { checkConfig, setConfig } from "./scripts/utils.js";

export default (async () => {
  setConfig({})
  await checkConfig();
})