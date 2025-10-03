import fs from 'fs';

const content = `import { checkConfig, setConfig } from "./scripts/utils.js";

export default (async () => {
  setConfig({})
  await checkConfig();
})`;

fs.writeFileSync('./ura.config.js', content);
console.log('Config reset successfully - ura.config.js now contains empty setConfig({})');
