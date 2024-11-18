import path from "path";
import { fileURLToPath } from "url";
import ts from "typescript";
import fs from "fs";
import net from "net";
import chokidar from "chokidar";
import * as sass from "sass";

function getMimeType(ext) {
  const mimeTypes = {
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".csv": "text/csv",
    ".ics": "text/calendar",
    ".js": "text/javascript",
    ".json": "application/json",
    ".xml": "application/xml",
    ".txt": "text/plain",
    ".ts": "video/mp2t",
    ".jsx": "text/jsx",
    ".tsx": "text/tsx",
    ".yaml": "application/x-yaml",
    ".yml": "application/x-yaml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".eot": "application/vnd.ms-fontobject",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".flac": "audio/flac",
    ".aac": "audio/aac",
    ".m4a": "audio/mp4",
    ".weba": "audio/webm",
    ".mid": "audio/midi",
    ".midi": "audio/midi",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogv": "video/ogg",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".mkv": "video/x-matroska",
    ".flv": "video/x-flv",
    ".wmv": "video/x-ms-wmv",
    ".mpg": "video/mpeg",
    ".mpeg": "video/mpeg",
    ".m4v": "video/x-m4v",
    ".zip": "application/zip",
    ".tar": "application/x-tar",
    ".gz": "application/gzip",
    ".bz2": "application/x-bzip2",
    ".xz": "application/x-xz",
    ".rar": "application/vnd.rar",
    ".7z": "application/x-7z-compressed",
    ".iso": "application/x-iso9660-image",
    ".dmg": "application/x-apple-diskimage",
    ".pdf": "application/pdf",
    ".exe": "application/vnd.microsoft.portable-executable",
    ".bin": "application/octet-stream",
    ".msi": "application/x-msdownload",
    ".dll": "application/x-msdownload",
    ".deb": "application/x-debian-package",
    ".rpm": "application/x-rpm",
    ".bat": "application/x-msdos-program",
    ".sh": "application/x-sh",
    ".jar": "application/java-archive",
    ".rtf": "application/rtf",
    ".psd": "image/vnd.adobe.photoshop",
    ".ai": "application/postscript",
    ".eps": "application/postscript",
    ".dxf": "image/vnd.dxf",
    ".dwg": "image/vnd.dwg",
    ".kml": "application/vnd.google-earth.kml+xml",
    ".kmz": "application/vnd.google-earth.kmz",
    ".vcf": "text/vcard",
    ".ics": "text/calendar",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TRANSPILE
const tsConfigPath = path.join(__dirname, "../tsconfig.json");
const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;
const parsedConfig = ts.parseJsonConfigFileContent(
  tsConfig,
  ts.sys,
  path.dirname(tsConfigPath)
);

const compileTypeScript = (srcFilePath, outFilePath) => {
  const program = ts.createProgram([srcFilePath], parsedConfig.options);
  const emitResult = program.emit();
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  if (allDiagnostics.length > 0) {
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } =
          diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );
        console.error(
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      } else
        console.error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        );
    });
  } else {
    // Write compiled JavaScript to output file
    const outputText = ts.transpileModule(
      fs.readFileSync(srcFilePath, "utf-8"),
      {
        compilerOptions: parsedConfig.options,
      }
    ).outputText;
    fs.writeFileSync(outFilePath, outputText, "utf-8");
  }
};

// HANDLE FILES
function Delete(srcPath) {
  let outPath = srcPath.replace("src", "out");

  try {
    // Check if the output path is a directory
    if (fs.statSync(outPath).isDirectory()) {
      fs.rmSync(outPath, { recursive: true, force: true });
      console.log("Deleted directory:", outPath);
      return;
    }

    let extensions = null;
    let srcExists = false;

    // Check if the file is a source file that could have multiple extensions
    if (/\.(ts|tsx|jsx|js)$/i.test(srcPath)) {
      extensions = [".ts", ".tsx", ".jsx", ".js"];
    } else if (/\.(scss|css)$/i.test(srcPath)) {
      extensions = [".scss", ".css"];
    }

    // If extensions were set (meaning the file could have multiple extensions), check for their existence
    if (extensions !== null && extensions.length) {
      // Remove the extension from the path
      let basePath = srcPath.replace(/\.(ts|tsx|jsx|js|scss|css)$/i, "");

      // Check if any of the extensions exist in the source path
      srcExists = extensions.some((ext) => fs.existsSync(basePath + ext));

      // If alternative source file exists, skip the delete
      if (srcExists) {
        console.log("Skipping delete as alternative exists in src:", basePath);
        return;
      }
    }

    // If it's a file, delete it
    console.log("Deleted file:", outPath);
    fs.unlinkSync(outPath);
  } catch (error) {
    // If the file or directory doesn't exist (ENOENT), ignore it
    if (error.code !== "ENOENT") {
      console.error("Error deleting:", outPath, error);
    }
  }
}

let CONFIG = null;

function open_config() {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8")
  );
  data["SOURCE"] = path.join(__dirname, "../src");
  data["OUTPUT"] = path.join(__dirname, "../out");
  data["ROOT"] = path.join(__dirname, "../");
  return data;
}

const GET = (name) => {
  if (CONFIG == null) CONFIG = open_config();
  return CONFIG[name];
};

function transpileSass(src, dest) {
  try {
    const result = sass.compile(src);
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.writeFileSync(dest, result.css);
  } catch (error) {
    console.error("Error compiling Sass:", error);
  }
}

function transpileSassDirectory(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach((file) => {
    const fullPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file.replace(/\.scss$/, ".css"));

    if (fs.statSync(fullPath).isDirectory()) {
      transpileSassDirectory(fullPath, path.join(destDir, file));
    } else if (/\.(scss)$/i.test(file)) {
      transpileSass(fullPath, destPath);
    }
  });
}

function Copy(src) {
  try {
    const dest = src.replace("src", "out");
    // Check if src is a directory
    if (fs.lstatSync(src).isDirectory()) {
      const entries = fs.readdirSync(src); // Get all items in the directory
      entries.forEach((entry) => {
        const fullPath = path.join(src, entry); // Construct the full path for each item
        Copy(fullPath); // Recursively call Copy on each item
      });
    } else if (!/\.(ts|tsx|jsx|js|scss)$/i.test(src)) {
      console.log("Copy", path.relative(GET("SOURCE"), src));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    } else if (/\.(ts|tsx|jsx|js)$/i.test(src)) {
      const Jsfile = dest.replace(/\.(ts|tsx|jsx|js)$/i, ".js");
      console.log("Transpile", path.relative(GET("SOURCE"), src));
      compileTypeScript(src, Jsfile);
    } else if (/\.(scss)$/i.test(src)) {
      console.log("Transpile Sass", path.relative(GET("SOURCE"), src));
      const outputFileName = path.basename(src, ".scss") + ".css";
      if (outputFileName === "global.css") {
        transpileSassDirectory(GET("SOURCE"), GET("OUTPUT"));
      } else {
        const destDir = path.dirname(dest);
        transpileSass(src, path.join(destDir, outputFileName));
      }
    }
  } catch (error) {
    console.error("An error occurred while copying file:", src, error);
  }
}

// ROUTING
const pagesDir = path.join(GET("SOURCE"), "pages");
const routesFile = path.join(pagesDir, "routes.json");
let routes = {};
let styles = [];

function generateRoutes(dirPath, parentRoute, addingRoute) {
  const Contents = fs.readdirSync(dirPath, { withFileTypes: true });
  Contents.forEach((sub) => {
    if (sub.isDirectory()) {
      const currentRoute = `${parentRoute}/${sub.name}`;
      if (addingRoute) {
        const Extensions = [".js", ".jsx", ".ts", ".tsx"];

        let filePath = null;
        for (const ext of Extensions) {
          const curr = path.join(dirPath, sub.name, `${sub.name}${ext}`);
          if (fs.existsSync(curr)) {
            filePath = curr;
            break;
          }
        }
        if (filePath !== null)
          routes[currentRoute] = `/pages${parentRoute}/${sub.name}/${sub.name}.js`;
        else addingRoute = false;
      }
      generateRoutes(path.join(dirPath, sub.name), currentRoute, addingRoute);
    } else if (sub.isFile() && /\.(css|scss)$/.test(sub.name)) {
      const cssFile = `/pages${parentRoute}/${path
        .basename(sub.name)
        .replace(/\.(scss|css)$/i, ".css")}`;
      // console.log("parent", parentRoute);
      // console.log("append", path.basename(sub.name).replace(/\.(scss|css)$/i, ".css"));
      // console.log(cssFile);
      styles.push(cssFile);
    }
  });
}

function generateRoutes1(dirPath, parentRoute = "") {
  const dirContents = fs.readdirSync(dirPath, { withFileTypes: true });

  dirContents.forEach((dir) => {
    if (dir.isDirectory()) {
      const currentRoute = `${parentRoute}/${dir.name}`;

      const fileExtensions = [".js", ".jsx", ".ts", ".tsx"];
      let filePath = null;
      let cssfile = null;

      for (const ext of fileExtensions) {
        const potentialPath = path.join(dirPath, dir.name, `${dir.name}${ext}`);
        if (fs.existsSync(potentialPath)) {
          if (
            [".css", ".scss"].some((ext) =>
              fs.existsSync(path.join(dirPath, dir.name, `${dir.name}${ext}`))
            )
          )
            cssfile = `.${parentRoute}/${dir.name}/${dir.name}.css`;
          filePath = potentialPath;
          break;
        }
      }

      if (filePath !== null) {
        routes.push({
          path: currentRoute,
          from: `.${parentRoute}/${dir.name}/${dir.name}.js`,
          ...(cssfile && { styles: [cssfile] }),
          ...(GET("DEFAULT_ROUTE") === currentRoute && { base: true }),
        });
        routes.push(
          ...generateRoutes1(path.join(dirPath, dir.name), currentRoute)
        );
      } else {
      }
    }
  });

  return routes;
}

// Write the updated Routes array to Routes.js
function updateRoutes() {
  routes = {};
  styles = [];
  generateRoutes(pagesDir, "", true);
  fs.writeFileSync(
    routesFile,
    JSON.stringify(
      {
        routes,
        styles,
        base: GET("DEFAULT_ROUTE"),
        type: GET("TYPE") === "dev" ? "dev" : "build",
      },
      null,
      2
    ),
    "utf8"
  );
  console.log("Routes file updated successfully!");
  // process.exit(1);
}

// CHECK PORT
function checkPortInUse(port, callback) {
  const server = net.createServer();
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      return checkPortInUse(port + 1, callback);
    } else {
      callback(false, port, err);
    }
  });
  server.once("listening", () => {
    server.close();
    callback(false, port);
  });
  server.listen(port);
}

// WATCH FILE ONCHANGE
function Watcher(watchPath, events, param, callback) {
  const watch = chokidar.watch(watchPath, param || {});
  events.forEach((event) => {
    // console.log(watchPath, "changed");
    watch.on(event, callback);
  });
  watch.on("error", (error) => console.error(`Watcher error: ${error}`));
  // console.log(`Started watching: ${path.relative("../", watchPath)}`);
}

function logServerMsg(port) {
  console.clear();
  console.log(`
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
\x1b[1m\x1b[32m    UraJS Development Server is Running!        \x1b[0m
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
\x1b[1m\x1b[32m    open http://localhost:${port}               \x1b[0m
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
    `);
}

const UTILS = {
  GET: (name) => CONFIG[name],
  SET: (name, value) => {
    CONFIG[name] = value;
  },
  INIT: () => (CONFIG = open_config()),
  TYPE: getMimeType,
  DELETE: Delete,
  COPY: Copy,
  UPDATE_ROUTES: updateRoutes,
  CHECK_PORT: checkPortInUse,
  WATCH: Watcher,
  LOG: logServerMsg,
};

export default UTILS;
