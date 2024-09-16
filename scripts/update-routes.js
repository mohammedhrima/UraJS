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
const basePageDir = path.resolve(__dirname, "../src/pages");

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

const updateRoutes = () => {
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
};


export default updateRoutes