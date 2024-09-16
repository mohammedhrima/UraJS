//@ts-ignore
import fs from "fs";
// @ts-ignore
import path from "path";
// @ts-ignore
import { fileURLToPath } from "url";
// @ts-ignore
import dotenv from "dotenv";
// @ts-ignore
import compileTypeScript from "./transpile.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
// @ts-ignore
const __dirname = path.dirname(__filename);
const SRCDIR = path.resolve(__dirname, "../src");
const OUTDIR = path.resolve(__dirname, "../out");

// Function to copy files and compile TypeScript files
export const copyRecursive = (srcDir, outDir) => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.readdirSync(srcDir).forEach((pathname) => {
    const srcFile = path.join(srcDir, pathname);
    const outFile = path.join(outDir, pathname);

    if (fs.statSync(srcFile).isDirectory()) {
      copyRecursive(srcFile, outFile);
    } else if (!/\.(ts|tsx|jsx|js)$/i.test(pathname)) {
      fs.copyFileSync(srcFile, outFile);
    } else if (/\.(ts|tsx|jsx|js)$/i.test(pathname)) {
      // Compile TypeScript files and handle extensions
      const outFileJs = outFile.replace(/\.(ts|tsx|jsx)$/i, ".js");
      compileTypeScript(srcFile, outFileJs);
    }
  });
};

// Function to delete files and directories recursively
export const deleteRecursive = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const currPath = path.join(dirPath, file);
      if (fs.statSync(currPath).isDirectory()) deleteRecursive(currPath);
      else fs.unlinkSync(currPath);
    });
    fs.rmdirSync(dirPath);
  }
};

// Function to copy a single file and compile if necessary
export const copyFile = (srcPath) => {
  const destPath = srcPath.replace(SRCDIR, OUTDIR);
  if (!/\.(ts|tsx|jsx|js)$/i.test(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  } else {
    // Compile TypeScript files and handle extensions
    const outFileJs = destPath.replace(/\.(ts|tsx|jsx)$/i, ".js");
    compileTypeScript(srcPath, outFileJs);
  }
};