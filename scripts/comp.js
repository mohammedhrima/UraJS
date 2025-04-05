#!/usr/bin/env node
import { basename, join } from "path";
import { config, source, createFile, updateRoutes } from "./utils.js";
import { generateJSX, generateStyle } from "./gen.js";

if (process.argv.length < 3) {
  console.error("Usage: uracomp <comp1> <comp2> ...");
  process.exit(1);
}

async function createComponentFiles(name) {
  const holder = await import("../ura.config.js")
  await holder.default()

  const ext = config.typescript === "enable" ? "tsx" : "jsx";
  let styleExt = config.scss === "enable" ? "scss" : config.css === "enable" ? "css" : null;

  createFile(join(source, "./components/", basename(`${name}.${ext}`)), generateJSX(name));
  if (styleExt) createFile(join(source, "./components/", basename(`${name}.${styleExt}`)), generateStyle(name));
  updateRoutes();
}

process.argv.slice(2).forEach(createComponentFiles);