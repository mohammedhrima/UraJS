import { dirname, join, relative, extname as extension, basename, } from "path";
import { writeFileSync, statSync, existsSync, readFileSync, readdirSync, mkdirSync } from "fs";
import { promises as fs } from "fs";
import enquirer from 'enquirer';
import { fileURLToPath } from "url";
import ts from "typescript";
import * as sass from "sass";
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { logerror, loginfo, logmsg, logwarn } from "./debug.js";
import { generateComponent, generateStyle } from "./gen.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const root = join(__dirname, "../");
export const source = join(root, "./src");
export const output = join(root, "./out")

const tsConfig = {
  compilerOptions: {
    module: "ESNext",
    target: "ES2020",
    rootDir: source,
    outDir: output,
    baseUrl: "/",
    jsx: "react",
    jsxFactory: "Ura.e",
    jsxFragmentFactory: "Ura.fr",
    moduleResolution: "node",
    skipLibCheck: false,
    allowJs: true,
    resolveJsonModule: true,
    esModuleInterop: true,
    paths: {
      "@/module/*": ["src/module/*"]
    }
  },
  exclude: ["node_modules", "scripts", ".git", ".gitignore"]
};

const parsedConfig = ts.parseJsonConfigFileContent(tsConfig, ts.sys, source);

export function handleTypeScript(srcFile) {
  loginfo("transpile:", relative(source, srcFile));
  const program = ts.createProgram([srcFile], parsedConfig.options);
  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  if (allDiagnostics.length > 0) {
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        logerror(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        logerror(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      }
    });
  }
  handleTailwind();
}

export async function handleSass(pathname) {
  loginfo("transpile:", relative(source, pathname))
  try {
    const stat = await fs.stat(pathname);
    if (stat.isDirectory()) {
      const files = await fs.readdir(pathname);
      await Promise.all(files.map(file => handleSassAsync(join(pathname, file))));
    } else {
      const result = sass.compile(pathname);
      let sassfile = pathname.replace(source, output);
      sassfile = join(dirname(sassfile), basename(sassfile, ".scss") + ".css");
      await fs.mkdir(dirname(sassfile), { recursive: true });
      await fs.writeFile(sassfile, result.css);
    }
  } catch (error) {
    logerror("Error Sass:", pathname, error)
  }
}

async function handleSubSassfiles(parent) {
  const files = await fs.readdir(parent);

  for (const file of files) {
    const fullPath = join(parent, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await handleSubSassfiles(fullPath);
    } else if (stat.isFile() && /\.scss$/i.test(fullPath)) {
      await handleSass(fullPath);
    }
  }
}

export async function handleCopy(pathname) {
  try {
    const stat = await fs.stat(pathname);
    const ext = extension(pathname).toLowerCase();
    const dest = pathname.replace(source, output);

    if (stat.isDirectory()) {
      const files = await fs.readdir(pathname);
      await Promise.all(files.map(file => handleCopy(join(pathname, file))));
      return;
    }

    await fs.mkdir(dirname(dest), { recursive: true });

    const transpileExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
    if (transpileExtensions.has(extension(pathname))) handleTypeScript(pathname);
    else if (ext === ".scss") {
      if (pathname === join(source, "pages/global.scss")) {
        loginfo("global.scss modified, recompiling all scss...");
        handleSubSassfiles(join(source, "pages"));
      } else {
        handleSass(pathname);
      }
    }
    else {
      loginfo("copy", relative(source, pathname));
      await fs.copyFile(pathname, dest);
    }
  } catch (error) {
    logerror("copying:", pathname, error);
  }
}

export async function handleDelete(srcname) {
  const outname = srcname.replace(source, output)
    .replace(/\.(ts|tsx|jsx|js)$/i, ".js")
    .replace(/\.(scss|css)$/i, ".css");

  try {
    let stats;
    try {
      stats = await fs.stat(outname);
    } catch (err) {
      if (err.code === 'ENOENT') {
        logerror("File or directory does not exist:", relative(output, outname));
        return;
      }
      throw err;
    }

    if (stats.isDirectory()) {
      await fs.rm(outname, { recursive: true, force: true });
      loginfo("Deleted directory:", relative(output, outname));
      return;
    }

    let extensions = null;
    if (/\.(ts|tsx|jsx|js)$/i.test(srcname)) extensions = [".ts", ".tsx", ".jsx", ".js"];
    else if (/\.(scss|css)$/i.test(srcname)) extensions = [".scss", ".css"];

    if (extensions) {
      const basePath = srcname.replace(/\.(ts|tsx|jsx|js|scss|css)$/i, "");

      // Check if any source files still exist (async version)
      const sourceExists = await Promise.any(
        extensions.map(ext =>
          fs.access(basePath + ext)
            .then(() => true)
            .catch(() => false)
        )
      );

      if (sourceExists) {
        loginfo("Skipping deletion, source exists:", basePath);
        return;
      }
    }

    await fs.unlink(outname);
    loginfo("Deleted file:", relative(output, outname));
  } catch (error) {
    logerror("deleting:", relative(output, outname), error);
  }
}

export function handleTailwind() {
  if (config.tailwinds !== "enable") return;
  const inputCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
  const tailwindConfig = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extend: {} },
    plugins: [],
  }
  try {
    const tailwindPath = join(source, './pages/tailwind.css');
    const processor = postcss([tailwindcss(tailwindConfig)]);
    processor.process(inputCSS, { from: undefined }).then((result) => {
      writeFileSync(tailwindPath, result.css, 'utf-8');
    })
      .catch((err) => {
        throw new Error(`Error generating CSS: ${err.message}`);
      });
  } catch (err) {
    throw err
  }

}


export const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);
export const createFile = (filePath, content) => {
  mkdirSync(dirname(filePath), { recursive: true });
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    loginfo(`Created: ${filePath}`);
  } else {
    logwarn(`Skipped (already exists): ${filePath}`);
  }
};


/* will be used only if dirRouting is enabled */
/*
config.dirRouting
config.default
config.ext
config.taildwinds
config.style
config.typescript
config.port

const name = await new Input({
    name: 'name',
    message: 'What is your name?'
}).run();

const framework = await new Select({
    name: 'framework',
    message: 'Pick a framework',
    choices: ['React', 'Vue', 'Svelte']
}).run();
*/


export async function updateConfigFile() {
  const configPath = join(__dirname, '../ura.config.js');
  const configContent = `import { checkConfig, setConfig } from "./scripts/utils.js";

(async()=>{
  setConfig({
    ${Object.entries(config).map(([key, value]) => `${key}: ${JSON.stringify(value)},`)
      .join('\n    ')}
  })
})()
await checkConfig();`;

  writeFileSync(configPath, configContent);
  console.log('Configuration file updated successfully');
}

let _config = {}; // Private variable

export const config = {}; // Export empty object first

export function setConfig(obj = {}) {
  Object.assign(_config, obj);
  Object.assign(config, _config); // Sync with exported config
}
setConfig({});

let routes = {};
let styles = [];

const { Select, Input, Toggle } = enquirer;
export async function checkConfig() {
  let did_update = false;
  const promptToggle = async (message, key) => {
    const answer = await new Select({
      message,
      choices: [
        { title: 'Yes', value: 'enable' },
        { title: 'No', value: 'disable' }
      ],
    }).run();
    did_update = true;
    setConfig({ [key]: answer === "Yes" ? "enable" : "disable" });
  };

  const getAvailableRoutes = () => {
    return readdirSync(join(source, "/pages"))
      .filter(sub => statSync(join(source, "/pages", sub)).isDirectory())
      .map(sub => join("/", sub));
  };

  if (!config.typescript) await promptToggle('Enable TypeScript?', 'typescript');
  if (!config.dirRouting) await promptToggle('Enable directory routing?', 'dirRouting');
  if (config.dirRouting === "enable" && !config.defaultRoute) {
    const routes = getAvailableRoutes();
    const route = routes.length > 0
      ? await new Select({
        message: 'Choose default route',
        choices: routes
      }).run()
      : await new Input({
        name: 'default_route',
        message: 'Enter default route name:',
        initial: 'home',
        validate: value => /^[a-zA-Z_-]+$/.test(value.trim()) || 'Invalid name'
      }).run();

    setConfig({ defaultRoute: cleanPath(route) });
    did_update = true;
  }
  if (!config.tailwinds) await promptToggle('Enable Tailwind CSS?', 'tailwinds');
  if (!config.scss) await promptToggle('Enable SCSS?', 'scss');
  if (!config.port) {
    const port = await new Input({
      message: 'Enter port number:',
      initial: '17000',
      validate: value => {
        const p = parseInt(value);
        return (p > 0 && p < 65536) || 'Invalid port (1-65535)';
      }
    }).run();
    setConfig({ port: parseInt(port) });
    did_update = true;
  }

  console.log(config);
  if (did_update) updateConfigFile();
  if (config.dirRouting === "enable" && !existsSync(join(source, config.defaultRoute))) {
    const name = config.defaultRoute;
    const ext = config.typescript === "enable" ? "tsx" : "jsx";
    const styleExt = config.scss === "enable" ? "scss" : "css";

    createFile(join(source, `./pages/${name}/`, `${name}.${ext}`), generateComponent(name, 'route'));
    createFile(join(source, `./pages/${name}/`, `${name}.${styleExt}`), generateStyle(name, 'route'));
    updateRoutes();
  }
}


function cleanPath(path) {
  return path.replace(/\\/g, '/').replace("//", "/");
}

export default function updateStyles() {
  styles = [];
  function traverseDirectory(currentPath) {
    const files = readdirSync(currentPath);
    files.forEach(file => {
      const fullPath = join(currentPath, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (stat.isFile() && (file.endsWith('.css') || file.endsWith('.scss'))) {
        let relativePath = relative(source, fullPath).replace(/\\/g, '/');
        if (relativePath.endsWith('.scss')) relativePath = relativePath.replace(/\.scss$/, '.css');
        if (!relativePath.includes("styles.js")) { // Exclude styles.js itself
          styles.push(`./${relativePath}`);
          loginfo(`Added style path: ${relativePath}`);
        }
      }
    });
  }
  traverseDirectory(join(source, "./pages"));
  traverseDirectory(join(source, "./components"));
}

function generateRoutes(dir, parent, adding) {
  readdirSync(dir, { withFileTypes: true }).forEach(sub => {
    let tmp = adding;

    if (sub.isDirectory()) {
      const currRoute = `${parent}/${sub.name}`;
      let file = null;

      if (adding) {
        [".js", ".jsx", ".ts", ".tsx"].forEach(ext => {
          const curr = join(dir, sub.name, `${sub.name}${ext}`);
          if (existsSync(curr)) {
            file = curr;
            return;
          }
        });

        if (file !== null) {
          routes[currRoute] = cleanPath(`./${parent.slice(1)}/${sub.name}/${sub.name}.js`);
        } else {
          adding = false;
        }
      }
      generateRoutes(join(dir, sub.name), currRoute, adding);
    }
    adding = tmp;
  });
}

const pagesDir = join(source, 'pages');
routes = {};
styles = [];

export function updateRoutes() {
  if (config.dirRouting != "enable") {
    logwarn("dir routing is disabled")
    return;
  }
  routes = {};
  styles = {};
  generateRoutes(pagesDir, '', true);
  updateStyles();
  console.log(routes);


  const output = `/*
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

${Object.entries(routes).map(([key, path]) => `import ${capitalize(basename(path, '.js'))} from "${path}";`).join('\n')}

Ura.setRoutes({
  ${config.dirRouting == "enable" && `"*": ${capitalize(basename(routes[config.defaultRoute], '.js'))}`},
  ${Object.entries(routes).map(([key, path]) => `"${key}": ${capitalize(basename(path, '.js'))}`).join(',\n  ')}
});

Ura.setStyles(${JSON.stringify(styles, null, 2)});

Ura.start();`;

  writeFileSync(join(pagesDir, 'main.js'), output, 'utf8');
  loginfo("Routes and styles updated.");
}

