import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import compileTypeScript from "./transpile.js";
import { OUTDIR, SRCDIR, ROOTDIR } from "./dirs.js";

dotenv.config();

// export function copyRecursive(srcDir, outDir) {
//   if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

//   fs.readdirSync(srcDir).forEach((pathname) => {
//     const src = path.join(srcDir, pathname);
//     const out = path.join(outDir, pathname);

//     if (fs.statSync(src).isDirectory()) copyRecursive(src, out);
//     else if (!/\.(ts|tsx|jsx|js)$/i.test(pathname)) {
//       console.log("Copy", path.relative(SRCDIR, src));
//       fs.copyFileSync(src, out);
//     } else if (/\.(ts|tsx|jsx|js)$/i.test(pathname))
//       compileTypeScript(src, out.replace(/\.(ts|tsx|jsx)$/i, ".js"));
//   });
// }

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
