import path from "path";
import { fileURLToPath } from "url";
import ts from "typescript";
import fs from "fs";
import net from "net";
import chokidar from "chokidar";

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
const parsedConfig = ts.parseJsonConfigFileContent(tsConfig, ts.sys, path.dirname(tsConfigPath));

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
        console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,);
      } else console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    });
  } else {
    // Write compiled JavaScript to output file
    const outputText = ts.transpileModule(fs.readFileSync(srcFilePath, "utf-8"), {
      compilerOptions: parsedConfig.options,
    }).outputText;
    fs.writeFileSync(outFilePath, outputText, "utf-8");
  }
};

// HANDLE FILES
function Delete(pathname) {
  pathname = pathname.replace(GET("SOURCE"), GET("OUTPUT"))
  // if (fs.existsSync(pathname)) {
  //   fs.rmSync(pathname, { recursive: true, force: true });

  //   // if (fs.statSync(pathname).isDirectory()) {
  //   //   fs.readdirSync(pathname).forEach(subpath => {
  //   //     Delete(subpath);
  //   //   })
  //   //   fs.rmdirSync(pathname);
  //   // }
  //   // else
  //   //   fs.unlinkSync(pathname);
  // }
}

let CONFIG = null;

function open_config() {
  let data = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8"));
  data["SOURCE"] = path.join(__dirname, "../src")
  data["OUTPUT"] = path.join(__dirname, "../out")
  data["ROOT"] = path.join(__dirname, "../");
  return data
}

const GET = (name) => {
  if (CONFIG == null) CONFIG = open_config()
  return CONFIG[name]
}

function Copy(src) {
  const dest = src.replace("src", "out");
  if (!/\.(ts|tsx|jsx|js)$/i.test(src)) {
    console.log("Copy to ", dest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  } else {
    const Jsfile = dest.replace(/\.(ts|tsx|jsx)$/i, ".js");
    console.log("Transpile ", src);
    compileTypeScript(src, Jsfile);
  }
}

// ROUTING
const PageDir = path.join( GET("SOURCE"), "./pages");
const getRoutes = (dir) => {
  const result = {};
  try {
    fs.readdirSync(dir).forEach((fileOrDir) => {
      const fullPath = path.join(dir, fileOrDir);
      if (fs.statSync(fullPath).isDirectory()) {
        const routeName = fileOrDir.toLowerCase();
        if (routeName != "_utils") {
          const subroutes = getRoutes(fullPath);
          result[routeName] = {
            call: fileOrDir,
            dir: path.relative(PageDir, fullPath).replace(/\\/g, "/"),
            filename: `${fileOrDir}.js`,
            subpaths: Object.keys(subroutes).length ? subroutes : undefined,
          };
        }
      }
    });
  } catch (error) {
    console.error("Error reading directory:", error.message);
  }
  return result;
};

const updateRoutes = () => {
  let routes = getRoutes(PageDir);
  const defaultRoute = GET("DEFAULT_ROUTE");
  if (defaultRoute && routes[defaultRoute.toLowerCase()]) {
    console.warn("default route is", defaultRoute);
    routes[defaultRoute.toLowerCase()].default = true;
  } else if (defaultRoute) {
    console.error(`route '${defaultRoute}' not found in ./pages (update ./config.json)`);
    process.exit(1);
  } else {
    console.error(`Default route is required (update ./config.json)`);
    process.exit(1);
  }

  const output = JSON.stringify(routes, null, 2);
  const outPath = path.join(PageDir, "./routes.json");
  fs.writeFileSync(outPath, output, "utf8");
  console.log("Routes saved to routes.js");
};

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
  console.log(`Started watching: ${path.relative("../", watchPath)}`);
}

const UTILS = {
  GET: (name) => CONFIG[name],
  INIT: () => CONFIG = open_config(),
  TYPE: getMimeType,
  DELETE: Delete,
  COPY: Copy,
  UPDATE_ROUTES: updateRoutes,
  CHECK_PORT: checkPortInUse,
  WATCH: Watcher
}

export default UTILS