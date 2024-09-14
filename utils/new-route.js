import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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

if (command.toLowerCase() === "p" || command.toLowerCase() === "page") {
  basePath = basePageDir;
  // Construct the full directory path
  const dirPath = path.join(basePath, ...nameParts);
  // Check if directory already exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const fileName = nameParts[nameParts.length - 1];
  filePath = path.join(dirPath, `${fileName}.tsx`);
  cssPath = path.join(dirPath, `${fileName}.css`);
} else if (command.toLowerCase() === "c" || command.toLowerCase() === "component") {
  basePath = path.join(baseComponentDir, ...nameParts);
  // Create 'utils' and subdirectories if not existing
  const utilsDir = path.join(baseComponentDir, nameParts[0]);
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  const dirPath = path.join(utilsDir, "_utils", ...nameParts.slice(1));
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const fileName = nameParts[nameParts.length - 1];
  filePath = path.join(dirPath, `${fileName}.tsx`);
  cssPath = path.join(dirPath, `${fileName}.css`);
} else {
  console.error("Error: run program as follows: node script.js [c/p] [name]");
  process.exit(1);
}

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
import { MiniComponent } from "${typesPath}";
Mini.loadCSS("${relativeCssPath}");

function ${nameParts[nameParts.length - 1]}(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <div className="${nameParts[nameParts.length - 1].toLowerCase()}">${name}</div>
      );
    },
  };
}
export default ${nameParts[nameParts.length - 1]};
`;
fs.writeFileSync(cssPath, `/* Add your styles here */\n.${nameParts[nameParts.length - 1].toLowerCase()}\n{\n}\n`, "utf8");
} else if (command.toLowerCase() === "p" || command.toLowerCase() === "page") {
  tsFileContent = `import Mini from "${miniPath}";
import { MiniComponent } from "${typesPath}";
Mini.loadCSS("${relativeCssPath}");

function ${nameParts[nameParts.length - 1]}(): MiniComponent {
  const [key, state] = Mini.initState();
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div id="${nameParts[nameParts.length - 1].toLowerCase()}">${name}</div>
        </get>
      );
    },
  };
}
export default ${nameParts[nameParts.length - 1]};
`;
fs.writeFileSync(cssPath, `/* Add your styles here */\n#${nameParts[nameParts.length - 1].toLowerCase()} {\n}\n`, "utf8");
}

fs.writeFileSync(filePath, tsFileContent, "utf8");

// Create the CSS file

console.log(`${command.charAt(0).toUpperCase() + command.slice(1)} '${name}' created`);

// Helper function to format directory names and files
const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

// Function to recursively get routes
const getRoutes = (dir) => {
  const result = {};

  try {
    const filesAndDirs = fs.readdirSync(dir);

    filesAndDirs.forEach((fileOrDir) => {
      const fullPath = path.join(dir, fileOrDir);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        const routeName = fileOrDir.toLowerCase(); // Convert to lowercase for routes
        if (routeName != "_utils") {
          const subroutes = getRoutes(fullPath);

          result[routeName] = {
            call: formatName(routeName), // Add 'call' attribute for each route
            dir: path.relative(basePageDir, fullPath).replace(/\\/g, "/"),
            filename: `${formatName(routeName)}.js`, // Capitalize the first letter for filenames
            subpaths: Object.keys(subroutes).length ? subroutes : undefined, // Use object format for subpaths
          };
        }
      }
    });
  } catch (error) {
    console.error("Error reading directory:", error.message);
  }

  return result;
};

// Generate the routes
let routes = getRoutes(basePageDir);

// Mark the default route if specified and exists
const defaultRoute = process.env.DEFAULT_ROUTE;
if (defaultRoute && routes[defaultRoute.toLowerCase()]) {
  routes[defaultRoute.toLowerCase()].default = true;
} else if (defaultRoute) {
  console.warn(`Default route '${defaultRoute}' not found in the routes.`);
}

// Convert routes object to JSON string with formatted indentation
const output = `const Routes = ${JSON.stringify(
  routes,
  null,
  2
)};\n\nexport default Routes;`;

// Write the routes to the routes.js file
fs.writeFileSync(path.join(__dirname, "../src/pages/routes.js"), output, "utf8");

console.log("Routes saved to routes.js");
