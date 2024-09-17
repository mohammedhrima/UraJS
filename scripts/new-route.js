import fs from "fs";
import path from "path";
import process from "process";
import dotenv from "dotenv";
import { SRCDIR } from "./dirs.js";
import updateRoutes from "./update-routes.js";

dotenv.config();

const baseDir = path.resolve(SRCDIR, "./pages");
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("run: node script.js [c (Component) or p (Page)] [name]");
  process.exit(1);
}

const command = args[0];
const name = args[1];

const nameParts = name
  .split("/")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

let basePath;
let filePath;
let cssPath;
let dirPath;

if (command.toLowerCase() === "p" || command.toLowerCase() === "page") {
  basePath = baseDir;
  dirPath = path.join(basePath, ...nameParts);
} else if (command.toLowerCase() === "c" || command.toLowerCase() === "component") {
  basePath = path.join(baseDir, ...nameParts);
  const utilsDir = path.join(baseDir, nameParts[0]);
  dirPath = path.join(utilsDir, "_utils", ...nameParts.slice(1));
} else {
  console.error("Error: run program as follows: node script.js [c/p] [name]");
  process.exit(1);
}

if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
const fileName = nameParts[nameParts.length - 1];
filePath = path.join(
  dirPath,
  `${fileName}${process.env.EXTENTION == "ts" ? ".tsx" : ".jsx"}`
);
cssPath = path.join(dirPath, `${fileName}.css`);

const miniPath = path.relative(dirPath, path.resolve(SRCDIR, "./mini/mini.js"));
const typesPath = path.relative(dirPath, path.resolve(SRCDIR, "./mini/types.js"));
const relativeCssPath = path.relative("src", cssPath);

// Create the TypeScript file
let tsFileContent = "";

if (command.toLowerCase() === "c" || command.toLowerCase() === "component") {
  tsFileContent = `// ${path.relative(SRCDIR, filePath)}
import Mini from "${miniPath}";
${process.env.EXTENTION == "ts" ? `import { MiniComponent } from "${typesPath}";` : ""}
Mini.loadCSS("${relativeCssPath}");

function ${nameParts[nameParts.length - 1]}()${
    process.env.EXTENTION == "ts" ? `: MiniComponent` : ""
  } {
  const [key, state] = Mini.initState();
  const [getter, setter] = state${process.env.EXTENTION == "ts" ? `<number>` : ""}(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div className="${nameParts[nameParts.length - 1].toLowerCase()}">${name}</div>
          <br />
          <button
              onclick={() => {
                setter(getter() + 1);
              }} >
            clique me
          </button>
        </>
      );
    },
  };
}
export default ${nameParts[nameParts.length - 1]};
`;
  fs.writeFileSync(
    cssPath,
    `/* Add your styles here */\n.${nameParts[
      nameParts.length - 1
    ].toLowerCase()}\n{\n}\n`,
    "utf8"
  );
} else if (command.toLowerCase() === "p" || command.toLowerCase() === "page") {
  tsFileContent = `// ${path.relative(SRCDIR, filePath)}
import Mini from "${miniPath}";
${process.env.EXTENTION == "ts" ? `import { MiniComponent } from "${typesPath}";` : ""}
Mini.loadCSS("${relativeCssPath}");

function ${nameParts[nameParts.length - 1]}()${
    process.env.EXTENTION == "ts" ? `: MiniComponent` : ""
  } {
  const [key, state] = Mini.initState();
  const [getter, setter] = state${process.env.EXTENTION == "ts" ? `<number>` : ""}(0)
  return {
    key: key,
    render: () => {
      return (
        <root>
          <div id="${nameParts[
            nameParts.length - 1
          ].toLowerCase()}">${name} counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </root>
      );
    },
  };
}
export default ${nameParts[nameParts.length - 1]};
`;
  fs.writeFileSync(
    cssPath,
    `/*${path.relative(SRCDIR, cssPath)}*/
#${nameParts[nameParts.length - 1].toLowerCase()} {\n}\n`,
    "utf8"
  );
}

fs.writeFileSync(filePath, tsFileContent, "utf8");

updateRoutes();
console.log(`${command.charAt(0).toUpperCase() + command.slice(1)} '${name}' created`);
