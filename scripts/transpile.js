import ts from "typescript";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";

// Load tsconfig.json
const tsConfigPath = path.resolve("./tsconfig.json");
const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;
const parsedConfig = ts.parseJsonConfigFileContent(
  tsConfig,
  ts.sys,
  path.dirname(tsConfigPath)
);

// Function to compile TypeScript code based on tsconfig.json
const compileTypeScript = (srcFilePath, outFilePath) => {
  // Ensure the directory for the output file exists
  const program = ts.createProgram([srcFilePath], parsedConfig.options);
  const emitResult = program.emit();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start
        );
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        console.log(
          `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
        );
      } else {
        console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      }
    });
  } else {
    // Write compiled JavaScript to output file
    const outputText = ts.transpileModule(fs.readFileSync(srcFilePath, "utf-8"), {
      compilerOptions: parsedConfig.options,
    }).outputText;
    fs.writeFileSync(outFilePath, outputText, "utf-8");
    console.log(`Compiled ${srcFilePath} to ${outFilePath}`);
  }
};

// // // Function to set up watch mode
// const watchAndCompile = (srcFilePath: string, outFilePath: string) => {
//   const watcher = chokidar.watch(srcFilePath, {
//     persistent: true,
//     ignoreInitial: false, // Compile existing file when starting
//   });

//   watcher.on('change', () => compileTypeScript(srcFilePath, outFilePath));

//   console.log(`Watching ${srcFilePath} for changes...`);
// };

// Example usage
// const srcFilePath = path.resolve('./index.tsx'); // Source file path
// const outFilePath = path.resolve('./index.js'); // Output file path

// compileTypeScript(srcFilePath, outFilePath);

export default compileTypeScript;
