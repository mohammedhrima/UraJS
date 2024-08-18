const fs = require("fs");
const path = require("path");
const swc = require("@swc/core");

function removeComments(code) {
  return code.replace(/\/\*\*?[\s\S]*?\*\/|\/\/.*/g, "");
}

function transpileFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  swc
    .transform(content, {
      filename: path.basename(filePath),
      jsc: {
        parser: {
          syntax: "ecmascript",
          jsx: true,
          dynamicImport: true,
        },
        transform: {
          react: {
            pragma: "createElement",
            pragmaFrag: "createFragment",
          },
        },
        target: "es2015",
      },
    })
    .then((result) => {
      let transpiledCode = result.code;
      transpiledCode = removeComments(transpiledCode);
      //   const distPath = filePath.replace(/src/, "dist");
      //   const distDir = path.dirname(distPath);
      //   if (!fs.existsSync(distDir)) {
      //     fs.mkdirSync(distDir, { recursive: true });
      //   }
      distPath = path.resolve(__dirname, "./out.js");
      fs.writeFileSync(distPath, transpiledCode);
      console.log(`Transpiled ${filePath} to ${distPath}`);
    })
    .catch((err) => {
      console.error(`Error transpiling ${filePath}:`, err);
    });
}

transpileFile(path.resolve(__dirname, "./src.js"));
