#!/usr/bin/env node
import { join } from "path";
import { config, source, createFile } from "./utils.js";
import { generateComponent, generateStyle } from "./gen.js";

if (process.argv.length < 3) {
  console.error("Usage: uracomp <comp1> <comp2> ...");
  process.exit(1);
}

process.argv.slice(2).forEach((name) => {
  const ext = config.typescript === "enable" ? "tsx" : "jsx";
  const styleExt = config.scss === "enable" ? "scss" : "css";

  createFile(join(source, "./components/", `${name}.${ext}`), generateComponent(name));
  createFile(join(source, "./components/", `${name}.${styleExt}`), generateStyle(name));
});