import ts from "typescript";
import fs from "fs";
import path from "path";
import { SRCDIR } from "./dirs.js";

const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const tsConfigPath = path.resolve("./tsconfig.json");
const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;
const parsedConfig = ts.parseJsonConfigFileContent(
  tsConfig,
  ts.sys,
  path.dirname(tsConfigPath)
);

const compileTypeScript = (srcFilePath, outFilePath) => {
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
          RED,
          `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
          RESET
        );
      } else console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    });
  } else {
    // Write compiled JavaScript to output file
    const outputText = ts.transpileModule(fs.readFileSync(srcFilePath, "utf-8"), {
      compilerOptions: parsedConfig.options,
    }).outputText;
    fs.writeFileSync(outFilePath, outputText, "utf-8");
    console.log(`Transpile ${path.relative(SRCDIR, srcFilePath)}`);
  }
};

export default compileTypeScript;
