import fs from "fs";
import path from "path";
import { SRCDIR, GET_CONFIG } from "./utils.js";

const PageDir = path.resolve(SRCDIR, "./pages");
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
            call: fileOrDir,
            dir: path.relative(PageDir, fullPath).replace(/\\/g, "/"),
            filename: `${fileOrDir}.js`,
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
  const defaultRoute = GET_CONFIG().DEFAULT_ROUTE;
  if (defaultRoute && routes[defaultRoute.toLowerCase()]) {
    console.warn("default route is", defaultRoute);
    routes[defaultRoute.toLowerCase()].default = true;
  } else if (defaultRoute) {
    console.error(`route '${defaultRoute}' not found in ./pages (update ./config.json)`);
    process.exit(1);
  } else {
    console.error(`Default route is required (update ./config.json)`);
    process.exit(1);
  }

  const output = JSON.stringify(routes, null, 2);
  fs.writeFileSync(path.join(SRCDIR, "./pages/routes.json"), output, "utf8");
  console.log("Routes saved to routes.js");
};

export default updateRoutes;
