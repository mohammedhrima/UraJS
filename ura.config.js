import { checkConfig, setConfig } from "./scripts/utils.js";

export default (async () => {
  setConfig({
  "typescript": "enable",
  "dirRouting": "enable",
  "defaultRoute": "home",
  "styling": "CSS",
  "port": 17000
})
  await checkConfig();
})