#!/usr/bin/env node
import { basename, join } from "path";
import { config, source, createFile, updateRoutes, root } from "./utils.js";
import {
  generateJSX,
  generateStyle,
  generateHeader,
  generateMain,
  generateFooter,
} from "./gen.js";

if (process.argv.length < 3) {
  console.error("Usage: uraroute <route1> <route2> ...");
  process.exit(1);
}

export async function createRouteFiles(name: string): Promise<void> {
  const holder = await import(join(root, "ura.config.js"));
  await holder.default();

  const ext = config.typescript === "enable" ? "tsx" : "jsx";
  let styleExt = config.styling === "SCSS" ? "scss" : config.styling === "CSS" ? "css" : null;

  createFile(
    join(source, `./pages/${name}/`, basename(`${name}.${ext}`)),
    generateJSX(name, "route")
  );

  createFile(
    join(source, `./pages/${name}/`, `header.${ext}`),
    generateHeader(name)
  );

  createFile(
    join(source, `./pages/${name}/`, `main.${ext}`),
    generateMain(name)
  );

  createFile(
    join(source, `./pages/${name}/`, `footer.${ext}`),
    generateFooter(name)
  );

  if (styleExt) {
    createFile(
      join(source, `./pages/${name}/`, basename(`${name}.${styleExt}`)),
      generateStyle(name, "route")
    );
  }

  updateRoutes();
}

process.argv.slice(2).forEach(createRouteFiles);
