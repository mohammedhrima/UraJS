import {
  dirname,
  join,
  relative,
  resolve,
  extname as extension,
  basename,
} from "path";
import {
  writeFileSync,
  statSync,
  existsSync,
  readFileSync,
  readdirSync,
  mkdirSync,
} from "fs";
import { promises as fs } from "fs";
import enquirer from "enquirer";
import { fileURLToPath } from "url";
import ts from "typescript";
import * as sass from "sass";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { logerror, loginfo, logmsg, logwarn } from "./debug.js";
import { generateJSX, generateStyle } from "./gen.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const root = join(__dirname, "../");
export const source = join(root, "./src");
export const output = join(root, "./out");

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
      "@/module/*": ["src/module/*"],
      ura: ["src/ura/code.tsx"],
    },
  },
  exclude: [
    "node_modules",
    "docker",
    "out",
    "scripts",
    "ura.config.js",
    "tailwind.config.js",
    ".git",
    ".gitignore",
  ],
};

const parsedConfig = ts.parseJsonConfigFileContent(tsConfig, ts.sys, source);

export function handleTypeScript(srcFile) {
  loginfo("transpile:", relative(source, srcFile));
  const program = ts.createProgram([srcFile], parsedConfig.options);
  const emitResult = program.emit();
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  if (allDiagnostics.length > 0) {
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } =
          diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );
        logerror(
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      } else {
        logerror(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      }
    });
  }

  const outputFile = srcFile
    .replace(source, output)
    .replace(/\.(tsx?|jsx?)$/, ".js");
  if (existsSync(outputFile)) {
    let content = readFileSync(outputFile, "utf8");

    if (content.includes("Ura.e(") && !content.includes("import Ura")) {
      content = `import Ura from "ura";\n${content}`;
      writeFileSync(outputFile, content, "utf8");
    }
  }

  handleTailwind();
}

export async function handleSass(pathname) {
  loginfo("transpile:", relative(source, pathname));
  try {
    const stat = await fs.stat(pathname);
    if (stat.isDirectory()) {
      const files = await fs.readdir(pathname);
      await Promise.all(
        files.map((file) => handleSassAsync(join(pathname, file)))
      );
    } else {
      const result = sass.compile(pathname);
      let sassfile = pathname.replace(source, output);
      sassfile = join(dirname(sassfile), basename(sassfile, ".scss") + ".css");
      await fs.mkdir(dirname(sassfile), { recursive: true });
      await fs.writeFile(sassfile, result.css);
    }
  } catch (error) {
    logerror("Error Sass:", pathname, error);
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

export async function fixImportExtensions(filePath) {
  const fullPath = resolve(filePath);
  let content;

  try {
    content = await fs.readFile(fullPath, "utf-8");
  } catch (err) {
    console.error(`Error: Failed to read ${filePath}`, err);
    return;
  }

  const lines = content.split("\n");
  const fixedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("import") &&
      /['"][^'"]+\.(ts|tsx|jsx)['"]\s*;?$/.test(trimmed)
    ) {
      return line.replace(/\.(ts|tsx|jsx)(['"])\s*;?$/, ".js$2");
    }

    return line;
  });

  const fixed = fixedLines.join("\n");

  if (fixed !== content) {
    try {
      await fs.writeFile(fullPath, fixed, "utf-8");
      logwarn(`Fixed imports in: ${relative(source, filePath)}`);
    } catch (err) {
      logerror(`Error: Failed to write ${filePath}`, err);
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
      await Promise.all(files.map((file) => handleCopy(join(pathname, file))));
      return;
    }

    await fs.mkdir(dirname(dest), { recursive: true });

    const transpileExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
    if (transpileExtensions.has(extension(pathname))) {
      await fixImportExtensions(pathname);
      handleTypeScript(pathname);
    } else if (ext === ".scss") {
      if (pathname === join(source, "pages/main.scss")) {
        loginfo("main.scss modified, recompiling all scss...");
        handleSubSassfiles(join(source, "pages"));
      } else {
        handleSass(pathname);
      }
    } else {
      loginfo("copy", relative(source, pathname));
      await fs.copyFile(pathname, dest);
    }
  } catch (error) {
    logerror("copying:", pathname, error);
  }
}

export async function handleDelete(srcname) {
  const outname = srcname
    .replace(source, output)
    .replace(/\.(ts|tsx|jsx|js)$/i, ".js")
    .replace(/\.(scss|css)$/i, ".css");

  try {
    let stats;
    try {
      stats = await fs.stat(outname);
    } catch (err) {
      if (err.code === "ENOENT") {
        logerror(
          "File or directory does not exist:",
          relative(output, outname)
        );
        return;
      }
      // throw err;
      logerror("handle delete", err);
    }

    if (stats.isDirectory()) {
      loginfo("Delete directory:", relative(output, outname));
      await fs.rm(outname, { recursive: true, force: true });
      return;
    }

    let extensions = null;
    if (/\.(ts|tsx|jsx|js)$/i.test(srcname))
      extensions = [".ts", ".tsx", ".jsx", ".js"];
    else if (/\.(scss|css)$/i.test(srcname)) extensions = [".scss", ".css"];

    if (extensions) {
      const basePath = srcname.replace(/\.(ts|tsx|jsx|js|scss|css)$/i, "");

      // Check if any source files still exist (async version)
      const sourceExists = await Promise.any(
        extensions.map((ext) =>
          fs
            .access(basePath + ext)
            .then(() => true)
            .catch(() => false)
        )
      );

      if (sourceExists) {
        loginfo("Skipping deletion, source exists:", basePath);
        return;
      }
    }

    loginfo("Delete file:", relative(output, outname));
    await fs.unlink(outname);
  } catch (error) {
    logerror("deleting:", relative(output, outname), error);
  }
}

export async function handleTailwind() {
  if (config.styling !== "Tailwind CSS") return;
  loginfo("handle tailwind change");

  const tailwindConfPath = join(root, "tailwind.config.js");

  // Create tailwind.config.js if it doesn't exist
  if (!existsSync(tailwindConfPath)) {
    fs.writeFileSync(
      tailwindConfPath,
      `export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        bg: '#0f172a',
        nav: '#1e293b',
        accent: '#26578d',
        text: '#e2e8f0',
        'text-muted': '#94a3b8',
        border: '#334155',
      },
    },
  },
  plugins: [],
};
`,
      "utf-8"
    );
  }

  // Input CSS with Tailwind directives
  const inputCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  const configModule = await import(join(root, "./tailwind.config.js"));
  const tailwindConfig = configModule.default;

  try {
    const tailwindPath = join(source, "./pages/tailwind.css");
    const processor = postcss([tailwindcss(tailwindConfig)]);

    const result = await processor.process(inputCSS, { from: undefined });
    writeFileSync(tailwindPath, result.css, "utf-8");
  } catch (err) {
    logerror("handleTailwind", err);
    throw new Error(`handletailwind generating CSS: ${err.message}`);
  }
}

export const capitalize = (name) =>
  name.charAt(0).toUpperCase() + name.slice(1);
export const createFile = (filePath, content) => {
  mkdirSync(dirname(filePath), { recursive: true });
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    loginfo(`Created: ${filePath}`);
  } else {
    logwarn(`Skipped (already exists): ${filePath}`);
  }
};

export async function updateConfigFile() {
  const configPath = join(root, "ura.config.js");
  const configContent = `import { checkConfig, setConfig } from "./scripts/utils.js";

export default (async () => {
  setConfig({
    ${Object.entries(config)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)},`)
      .join("\n    ")}
  })
  await checkConfig();
})
`;

  writeFileSync(configPath, configContent);
  logmsg("update ura.config.js file");
}

export const config = {}; // Export empty object first
let _config = {}; // Private variable

export async function setConfig(obj = {}) {
  Object.assign(_config, { ...obj, ...config });
  Object.assign(config, { ...config, ..._config }); // Sync with exported config
}

let routes = {};
let styles = [];

const { Select, Input, Toggle } = enquirer;
export async function checkConfig() {
  let did_update = false;
  const promptToggle = async (message, key) => {
    const answer = await new Select({
      message,
      choices: [
        { title: "Yes", value: "enable" },
        { title: "No", value: "disable" },
      ],
    }).run();
    setConfig({ [key]: answer === "Yes" ? "enable" : "disable" });
    did_update = true;
  };

  const getAvailableRoutes = () => {
    return readdirSync(join(source, "/pages"))
      .filter((sub) => statSync(join(source, "/pages", sub)).isDirectory())
      .map((sub) => join(sub));
  };

  if (!config.typescript)
    await promptToggle("Enable TypeScript?", "typescript");
  
  if (!config.dirRouting)
    await promptToggle("Enable directory routing?", "dirRouting");
  
  if (config.dirRouting === "enable" && !config.defaultRoute) {
    const routes = getAvailableRoutes();
    const route =
      routes.length > 0
        ? await new Select({
            message: "Choose default route",
            choices: routes,
          }).run()
        : await new Input({
            name: "default_route",
            message: "Enter default route name:",
            initial: "home",
            validate: (value) =>
              /^[a-zA-Z_-]+$/.test(value.trim()) || "Invalid name",
          }).run();

    setConfig({ defaultRoute: route });
    did_update = true;
  }

  // Styling - choose one option
  if (!config.styling) {
    const stylingChoice = await new Select({
      message: "Choose your styling:",
      choices: [
        { title: "CSS", value: "CSS" },
        { title: "SCSS", value: "SCSS" },
        { title: "Tailwind CSS", value: "Tailwind CSS" },
      ],
    }).run();

    setConfig({ styling: stylingChoice });
    did_update = true;
  }

  if (!config.port) {
    const port = await new Input({
      message: "Enter port number:",
      initial: "17000",
      validate: (value) => {
        const p = parseInt(value);
        return (p > 0 && p < 65536) || "Invalid port (1-65535)";
      },
    }).run();
    setConfig({ port: parseInt(port) });
    did_update = true;
  }

  if (did_update) updateConfigFile();
  if (
    config.dirRouting === "enable" &&
    !existsSync(join(source, "/pages", config.defaultRoute))
  ) {
    logwarn("create route", config.defaultRoute, "because it's default");
    const name = config.defaultRoute;
    const ext = config.typescript === "enable" ? "tsx" : "jsx";
    const styleExt = config.styling === "SCSS" ? "scss" : "css";
    createFile(
      join(source, `./pages/${name}/`, `${name}.${ext}`),
      generateJSX(name, "route")
    );
    createFile(
      join(source, `./pages/${name}/`, `${name}.${styleExt}`),
      generateStyle(name, "route")
    );
  }
  const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    bold: "\x1b[1m",
  };
  console.log("\n📋 Current Configuration:");
  console.log(
    `${colors.bold}${colors.cyan}┌───────────────────────────────┐${colors.reset}`
  );
  Object.entries(config).forEach(([key, value]) => {
    const paddedKey = key.padEnd(15, " ");
    console.log(
      `${colors.cyan}│ ${colors.reset}${colors.green}${paddedKey}${
        colors.reset
      }: ${colors.yellow}${JSON.stringify(value).padEnd(12, " ")}${
        colors.reset
      } ${colors.cyan}│${colors.reset}`
    );
  });
  console.log(
    `${colors.bold}${colors.cyan}└───────────────────────────────┘${colors.reset}\n`
  );
}

function cleanPath(path) {
  return path.replace(/\\/g, "/").replace("//", "/");
}

export default function updateStyles() {
  styles = [];
  function traverseDirectory(currentPath) {
    const files = readdirSync(currentPath);
    files.forEach((file) => {
      const fullPath = join(currentPath, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (
        stat.isFile() &&
        (file.endsWith(".css") || file.endsWith(".scss"))
      ) {
        let relativePath = relative(source, fullPath).replace(/\\/g, "/");
        if (relativePath.endsWith(".scss"))
          relativePath = relativePath.replace(/\.scss$/, ".css");
        if (!relativePath.includes("styles.js")) {
          // Exclude styles.js itself
          styles.push(`/${relativePath}`);
          loginfo(`Added style path: ${relativePath}`);
        }
      }
    });
  }
  traverseDirectory(join(source, "./pages"));
  traverseDirectory(join(source, "./components"));
  if (config.styling === "Tailwind CSS") styles.push("pages/tailwind.css");
}

function generateRoutes(dir, parent, adding) {
  readdirSync(dir, { withFileTypes: true }).forEach((sub) => {
    let tmp = adding;

    if (sub.isDirectory()) {
      const currRoute = `${parent}/${sub.name}`;
      let file = null;

      if (adding) {
        [".js", ".jsx", ".ts", ".tsx"].forEach((ext) => {
          const curr = join(dir, sub.name, `${sub.name}${ext}`);
          if (existsSync(curr)) {
            file = curr;
            return;
          }
        });

        if (file !== null) {
          routes[currRoute] = cleanPath(
            `./${parent.slice(1)}/${sub.name}/${sub.name}.js`
          );
        } else {
          adding = false;
        }
      }
      generateRoutes(join(dir, sub.name), currRoute, adding);
    }
    adding = tmp;
  });
}

const pagesDir = join(source, "pages");
routes = {};
styles = [];

await fs.mkdir(join(source, "components"), { recursive: true });
await fs.mkdir(join(source, "pages"), { recursive: true });
await fs.mkdir(join(source, "assets"), { recursive: true });
export function updateRoutes() {
  try {
    if (config.dirRouting !== "enable") {
      logwarn("dir routing is disabled");
      console.log(config);
      return;
    }

    routes = {};
    styles = {};
    generateRoutes(pagesDir, "", true);
    updateStyles();
    const maxRouteLength = Math.max(
      ...Object.keys(routes).map((r) => r.length)
    );
    const maxComponentLength = Math.max(
      ...Object.values(routes).map((c) => c.length)
    );
    const totalWidth = Math.max(40, maxRouteLength + maxComponentLength + 7); // Minimum width 40

    // Top border
    const topBorder = "╔" + "═".repeat(totalWidth - 2) + "╗";
    const headerText = "🚀 APPLICATION ROUTES";
    const headerPadding = Math.floor((totalWidth - 2 - headerText.length) / 2);
    const headerLine =
      "║" +
      " ".repeat(headerPadding) +
      headerText +
      " ".repeat(totalWidth - 2 - headerText.length - headerPadding) +
      "\x1b[36m║";

    // Middle border
    const middleBorder = "╠" + "═".repeat(totalWidth - 2) + "╣";

    console.log("\n\x1b[1m\x1b[36m" + topBorder);
    console.log(headerLine);
    console.log(middleBorder + "\x1b[0m");

    // Route lines
    Object.entries(routes).forEach(([route, component]) => {
      const routePart = `\x1b[33m${route}\x1b[0m`;
      const arrow = " → ";
      const componentPart = `\x1b[32m${component}\x1b[0m`;

      const padding = " ".repeat(
        totalWidth - 4 - route.length - arrow.length - component.length
      );
      console.log(
        `\x1b[36m║ ${routePart}${arrow}${componentPart}${padding} \x1b[36m║\x1b[0m`
      );
    });

    // Bottom border
    const bottomBorder = "╚" + "═".repeat(totalWidth - 2) + "╝";
    console.log("\x1b[1m\x1b[36m" + bottomBorder + "\x1b[0m\n");

    let default_route = null;
    if (config.dirRouting == "enable") {
      let route = routes[cleanPath(join("/", config.defaultRoute))];
      if (route) {
        const base = basename(route, ".js");
        default_route = capitalize(base);
      }
    }

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
  
${Object.entries(routes)
  .map(
    ([key, path]) =>
      `import ${capitalize(basename(path, ".js"))} from "${path}";`
  )
  .join("\n")}
  
Ura.setRoutes({
  ${default_route ? `"*": ${default_route},` : ""}
  ${Object.entries(routes)
    .map(([key, path]) => `"${key}": ${capitalize(basename(path, ".js"))}`)
    .join(",\n  ")}
});
  
Ura.setStyles(${JSON.stringify(styles, null, 2)});
  
Ura.start();`;

    writeFileSync(join(pagesDir, "main.js"), output, "utf8");
    loginfo("Routes and styles updated.");
  } catch (error) {
    logerror("updateRoutes", error);
  }
}
