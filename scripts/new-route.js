import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { spawn } from "child_process";

// Load environment variables
dotenv.config();

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define base directory paths
const basePageDir = path.resolve(__dirname, "../src/pages");
const baseComponentDir = path.resolve(__dirname, "../src/pages/");

// Function to calculate relative paths
const relativePath = (fromPath, toPath) =>
  path.relative(fromPath, toPath).replace(/\\/g, "/");

const args = process.argv.slice(2); // Get command-line arguments

if (args.length < 2) {
  console.error(
    "Error: run program as follows: node script.js [c (Component) or p (Page)] [name]"
  );
  process.exit(1);
}

const command = args[0];
const name = args[1];

// Split the name into components based on '/'
const nameParts = name
  .split("/")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

// Define the base directory path and file paths
let basePath;
let filePath;
let cssPath;
let dirPath;

if (command.toLowerCase() === "p" || command.toLowerCase() === "page") {
  basePath = basePageDir;
  dirPath = path.join(basePath, ...nameParts);
} else if (command.toLowerCase() === "c" || command.toLowerCase() === "component") {
  basePath = path.join(baseComponentDir, ...nameParts);
  const utilsDir = path.join(baseComponentDir, nameParts[0]);
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

// Calculate the relative import paths
const miniPath = relativePath(
  path.dirname(filePath),
  path.resolve(__dirname, "../src/mini/mini.js")
);
const typesPath = relativePath(
  path.dirname(filePath),
  path.resolve(__dirname, "../src/mini/types.js")
);
const relativeCssPath = relativePath("src", cssPath);

// Create the TypeScript file
let tsFileContent = "";

if (command.toLowerCase() === "c" || command.toLowerCase() === "component") {
  tsFileContent = `import Mini from "${miniPath}";
${process.env.EXTENTION == "ts" ? `import { MiniComponent } from "${typesPath}";` : ""}
Mini.loadCSS("${relativeCssPath}");

function ${nameParts[nameParts.length - 1]}()${process.env.EXTENTION == "ts" ? `: MiniComponent` : ""} {
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
  tsFileContent = `import Mini from "${miniPath}";
  ${process.env.EXTENTION == "ts" ? `import { MiniComponent } from "${typesPath}";` : ""}
Mini.loadCSS("${relativeCssPath}");

function ${nameParts[nameParts.length - 1]}()${process.env.EXTENTION == "ts" ? `: MiniComponent` : ""} {
  const [key, state] = Mini.initState();
  const [getter, setter] = state${process.env.EXTENTION == "ts" ? `<number>` : ""}(0)
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div id="${nameParts[nameParts.length - 1].toLowerCase()}">${name} counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </get>
      );
    },
  };
}
export default ${nameParts[nameParts.length - 1]};
`;
  fs.writeFileSync(
    cssPath,
    `/* Add your styles here */\n#${nameParts[
      nameParts.length - 1
    ].toLowerCase()} {\n}\n`,
    "utf8"
  );
}

fs.writeFileSync(filePath, tsFileContent, "utf8");

// Create the CSS file

console.log(`${command.charAt(0).toUpperCase() + command.slice(1)} '${name}' created`);

spawn("npm", ["run", "update"], {
  stdio: "inherit", // This will inherit the output (logs) to the main process
  shell: true, // Run in shell mode to allow execution on Windows
});
