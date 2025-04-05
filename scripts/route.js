#!/usr/bin/env node
import { join } from "path";
import { config, source, createFile, updateRoutes } from "./utils.js";
import { generateComponent, generateStyle } from "./gen.js";

if (process.argv.length < 3) {
  console.error("Usage: uraroute <route1> <route2> ...");
  process.exit(1);
}

export function createRouteFiles(name) {
  const ext = config.typescript === "enable" ? "tsx" : "jsx";
  const styleExt = config.scss === "enable" ? "scss" : "css";

  createFile(join(source, `./pages/${name}/`, `${name}.${ext}`), generateComponent(name, 'route'));
  createFile(join(source, `./pages/${name}/`, `${name}.${styleExt}`), generateStyle(name, 'route'));
  updateRoutes();
}

process.argv.slice(2).forEach(createRouteFiles);