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

interface Config {
  typescript?: string;
  dirRouting?: string;
  defaultRoute?: string;
  styling?: string;
  port?: number;
}

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
  exclude: ["node_modules", "scripts", ".git", ".gitignore"],
};

const parsedConfig = ts.parseJsonConfigFileContent(tsConfig, ts.sys, source);

export function handleTypeScript(srcFile: string): void {
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
  
  // Auto-inject Ura import for files that use JSX
  const outputFile = srcFile.replace(source, output).replace(/\.(tsx?|jsx?)$/, '.js');
  if (existsSync(outputFile)) {
    let content = readFileSync(outputFile, 'utf8');
    
    // Check if the file uses Ura.e (JSX was converted to Ura.e calls)
    if (content.includes('Ura.e(') && !content.includes('import Ura')) {
      // Add Ura import at the top
      content = `import Ura from "ura";\n${content}`;
      writeFileSync(outputFile, content, 'utf8');
    }
  }
  
  handleTailwind();
}

export async function handleSass(pathname: string): Promise<void> {
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
      writeFileSync(sassfile, result.css);
    }
  } catch (error) {
    logerror("sass error:", error);
  }
}

async function handleSassAsync(pathname: string): Promise<void> {
  const ext = extension(pathname);
  if (ext === ".scss") {
    await handleSass(pathname);
  }
}

export async function handleTailwind(): Promise<void> {
  if (config.styling !== "Tailwind CSS") return;
  loginfo("handle tailwind change");

  const tailwindConfPath = join(root, "tailwind.config.js");

  // Create tailwind.config.js if it doesn't exist
  if (!existsSync(tailwindConfPath)) {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
    writeFileSync(tailwindConfPath, tailwindConfig);
  }

  // Process CSS with Tailwind
  const inputPath = join(source, "pages/tailwind.css");
  const outputPath = join(output, "pages/tailwind.css");

  if (!existsSync(inputPath)) {
    const tailwindCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
    await fs.mkdir(dirname(inputPath), { recursive: true });
    writeFileSync(inputPath, tailwindCSS);
  }

  try {
    const css = readFileSync(inputPath, 'utf8');
    const result = await postcss([tailwindcss]).process(css, {
      from: inputPath,
      to: outputPath,
    });

    await fs.mkdir(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, result.css);
  } catch (error) {
    logerror("tailwind error:", error);
  }
}

export function createFile(filePath: string, data: string): void {
  if (!existsSync(filePath)) {
    try {
      writeFileSync(filePath, data);
      loginfo(relative(root, filePath), "created and data written successfully.");
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

export async function handleCopy(pathname: string): Promise<void> {
  const ext = extension(pathname);
  const dest = pathname.replace(source, output);

  if (statSync(pathname).isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const files = await fs.readdir(pathname);
    await Promise.all(files.map(file => handleCopy(join(pathname, file))));
    return;
  }

  await fs.mkdir(dirname(dest), { recursive: true });

  const transpileExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
  if (transpileExtensions.has(ext)) {
    await fixImportExtensions(pathname);
    handleTypeScript(pathname);
  }
  else if (ext === ".scss") {
    if (pathname === join(source, "pages/main.scss")) {
      loginfo("main.scss modified, recompiling all scss...");
      handleSubSassfiles(join(source, "pages"));
    } else {
      handleSass(pathname);
    }
  }
  else {
    try {
      await fs.copyFile(pathname, dest);
      loginfo("copy", relative(source, pathname));
    } catch (error) {
      logerror("copy error:", error);
    }
  }
}

async function handleSubSassfiles(dir: string): Promise<void> {
  const files = await fs.readdir(dir);
  await Promise.all(files.map(async (file) => {
    const filePath = join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await handleSubSassfiles(filePath);
    } else if (extension(file) === ".scss") {
      await handleSass(filePath);
    }
  }));
}

async function fixImportExtensions(pathname: string): Promise<void> {
  try {
    let content = readFileSync(pathname, 'utf8');
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    const importsToFix: string[] = [];

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('http')) {
        continue;
      }

      const ext = extension(importPath);
      if (!ext || ext === importPath) {
        const fullPath = resolve(dirname(pathname), importPath);
        const possibleExtensions = ['.js', '.ts', '.jsx', '.tsx'];
        
        for (const possibleExt of possibleExtensions) {
          if (existsSync(fullPath + possibleExt)) {
            importsToFix.push(importPath);
            break;
          }
        }
      }
    }

    importsToFix.forEach(importPath => {
      const fullPath = resolve(dirname(pathname), importPath);
      const possibleExtensions = ['.js', '.ts', '.jsx', '.tsx'];
      
      for (const possibleExt of possibleExtensions) {
        if (existsSync(fullPath + possibleExt)) {
          const newImportPath = importPath + possibleExt;
          content = content.replace(
            new RegExp(`import\\s+.*\\s+from\\s+['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
            (match) => match.replace(importPath, newImportPath)
          );
          break;
        }
      }
    });

    if (importsToFix.length > 0) {
      writeFileSync(pathname, content);
    }
  } catch (error) {
    logerror("fix import extensions error:", error);
  }
}

export async function handleDelete(pathname: string): Promise<void> {
  const outname = pathname.replace(source, output);
  try {
    if (statSync(outname).isDirectory()) {
      await fs.rmdir(outname, { recursive: true });
    } else {
      await fs.unlink(outname);
    }
    loginfo("deleting:", relative(output, outname));
  } catch (error) {
    logerror("deleting:", relative(output, outname), error);
  }
}

export async function checkConfig(): Promise<void> {
  let did_update = false;
  const promptToggle = async (message: string, key: keyof Config): Promise<void> => {
    const answer = await new (enquirer as any).Select({
      message,
      choices: [
        { title: "Yes", value: "enable" },
        { title: "No", value: "disable" },
      ],
    }).run();
    setConfig({ [key]: answer === "Yes" ? "enable" : "disable" });
    did_update = true;
  };

  const getAvailableRoutes = (): string[] => {
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
        ? await new (enquirer as any).Select({
            message: "Choose default route",
            choices: routes,
          }).run()
        : await new (enquirer as any).Input({
            name: "default_route",
            message: "Enter default route name:",
            initial: "home",
            validate: (value: string) =>
              /^[a-zA-Z_-]+$/.test(value.trim()) || "Invalid name",
          }).run();

    setConfig({ defaultRoute: route });
    did_update = true;
  }

  // Styling - choose one option
  if (!config.styling) {
    const stylingChoice = await new (enquirer as any).Select({
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
    const port = await new (enquirer as any).Input({
      message: "Enter port number:",
      initial: "17000",
      validate: (value: string) => {
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
    config.defaultRoute &&
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

export let config: Config = {};

export function setConfig(newConfig: Partial<Config>): void {
  config = { ...config, ...newConfig };
}

export function updateConfigFile(): void {
  const configPath = join(root, "ura.config.js");
  const configContent = `import { checkConfig, setConfig } from "./scripts/utils.js";

export default (async () => {
  setConfig(${JSON.stringify(config, null, 2)})
  await checkConfig();
})`;
  writeFileSync(configPath, configContent);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles: string[] = [];
const routes: { [key: string]: string } = {};

function generateRoutes(dir: string, parent: string, adding: string): void {
  readdirSync(dir, { withFileTypes: true }).forEach((sub) => {
    let tmp = adding;
    if (sub.isDirectory()) {
      tmp = join(adding, sub.name);
      generateRoutes(join(dir, sub.name), parent, tmp);
    } else {
      const ext = extension(sub.name);
      if (ext === ".js" || ext === ".jsx" || ext === ".ts" || ext === ".tsx") {
        const routePath = join(parent, tmp, sub.name);
        const cleanRoute = routePath.replace(/\\/g, "/").replace(/\.(js|jsx|ts|tsx)$/, "");
        routes[cleanRoute] = routePath;
      }
    }
  });
}

export function updateRoutes(): void {
  const pagesDir = join(source, "pages");
  const componentsDir = join(source, "components");
  
  // Clear existing routes
  Object.keys(routes).forEach(key => delete routes[key]);
  
  // Add page routes
  generateRoutes(pagesDir, "", "");
  
  // Add component routes
  generateRoutes(componentsDir, "", "");
  
  // Add styles
  if (config.styling === "Tailwind CSS") styles.push("pages/tailwind.css");
  
  // Generate main.js with routes
  const output = `import Ura from "ura";

const routes = ${JSON.stringify(routes, null, 2)};

Ura.setRoutes(routes);

Ura.setStyles(${JSON.stringify(styles)});

Ura.start();`;

  writeFileSync(join(pagesDir, 'main.js'), output, 'utf8');
  loginfo("Routes and styles updated.");
}

// Initialize styles array
styles.length = 0;

await fs.mkdir(join(source, "components"), { recursive: true });
await fs.mkdir(join(source, "pages"), { recursive: true });
await fs.mkdir(join(source, "assets"), { recursive: true });
