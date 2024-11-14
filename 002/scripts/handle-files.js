import fs from "fs";
import path from "path";
import compileTypeScript from "./transpile.js";
import { OUTDIR, SRCDIR } from "./utils.js";

export function deleteRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((pathname) => {
      const currPath = path.join(dirPath, pathname);
      if (fs.statSync(currPath).isDirectory()) deleteRecursive(currPath);
      else fs.unlinkSync(currPath);
    });
    fs.rmdirSync(dirPath);
  }
}

export function copyFile(srcPath) {
  const destPath = srcPath.replace(SRCDIR, OUTDIR);
  if (!/\.(ts|tsx|jsx|js)$/i.test(srcPath)) {
    console.log("Copy ", path.relative(SRCDIR, srcPath));
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  } else {
    const outFileJs = destPath.replace(/\.(ts|tsx|jsx)$/i, ".js");
    compileTypeScript(srcPath, outFileJs);
  }
}
