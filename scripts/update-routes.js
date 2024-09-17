import fs from "fs";
import path from "path";
import process from "process";
import dotenv from "dotenv";
import { SRCDIR } from "./dirs.js";

dotenv.config();

const PageDir = path.resolve(SRCDIR, "./pages");
const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

const getRoutes = (dir) => {
  const result = {};

  try {
    const filesAndDirs = fs.readdirSync(dir);

    filesAndDirs.forEach((fileOrDir) => {
      const fullPath = path.join(dir, fileOrDir);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        const routeName = fileOrDir.toLowerCase(); 
        if (routeName != "_utils") {
          const subroutes = getRoutes(fullPath);

          result[routeName] = {
            call: formatName(routeName),
            dir: path.relative(PageDir, fullPath).replace(/\\/g, "/"),
            filename: `${formatName(routeName)}.js`,
            subpaths: Object.keys(subroutes).length ? subroutes : undefined,
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
  let routes = getRoutes(PageDir);
  const defaultRoute = process.env.DEFAULT_ROUTE;
  if (defaultRoute && routes[defaultRoute.toLowerCase()])
    routes[defaultRoute.toLowerCase()].default = true;
  else if (defaultRoute)
    console.warn(`Default route '${defaultRoute}' not found in the routes.`);

  const output = `const Routes = ${JSON.stringify(
    routes,
    null,
    2
  )};\n\nexport default Routes;`;
  fs.writeFileSync(path.join(SRCDIR, "./pages/routes.js"), output, "utf8");
  console.log("Routes saved to routes.js");
};

export default updateRoutes;
