import { dirname, join, relative, extname as extension, basename, } from "path";
import { writeFileSync, statSync, rmSync, existsSync, mkdirSync, readFileSync, copyFileSync, unlinkSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import ts from "typescript";
import * as sass from "sass";
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { logerror, loginfo, logmsg } from "./debug.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const source = join(__dirname, "../src");
export const output = join(__dirname, "../out");
export const root = join(__dirname, "../");

const tsConfigPath = join(__dirname, "../tsconfig.json");
const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;
const parsedConfig = ts.parseJsonConfigFileContent(tsConfig, ts.sys, dirname(tsConfigPath));

export function handleTypeScript(srcFile) {
  loginfo("transpile:", relative(source, srcFile))
  const program = ts.createProgram([srcFile], parsedConfig.options);
  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  if (allDiagnostics.length > 0) {
    allDiagnostics.forEach((diagnostic) => {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        logerror(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else
        logerror(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    });
  }
  handleTailwind();
};

export function handleSass(pathname) {
  loginfo("transpile:", relative(source, pathname))
  try {
    if (statSync(pathname).isDirectory()) {
      readdirSync(pathname).forEach(elem => handleSass(join(pathname, elem)))
    }
    else {
      const result = sass.compile(pathname);
      let sassfile = pathname.replace(source, output);
      sassfile = join(dirname(sassfile), basename(sassfile, ".scss") + ".css");
      if (!existsSync(dirname(sassfile))) mkdirSync(dirname(sassfile), { recursive: true })
      writeFileSync(sassfile, result.css);
    }
  } catch (error) {
    logerror("Error Sass:", pathname, error)
  }
}

function handleSubSassfiles(parent) {
  readdirSync(parent).forEach(sub => {
    sub = join(parent, sub)
    if (statSync(sub).isDirectory())
      handleSubSassfiles(sub);
    else if (statSync(sub).isFile() && /\.(scss)$/i.test(sub))
      handleSass(sub);
  })
}

export function handleCopy(pathname) {
  try {
    const dest = pathname.replace(source, output);
    if (!existsSync(dirname(dest))) mkdirSync(dirname(dest), { recursive: true });

    if (statSync(pathname).isDirectory()) {
      readdirSync(pathname).forEach((elem) => handleCopy(join(pathname, elem)));
    }
    else if ([".js", ".jsx", ".ts", ".tsx"].includes(extension(pathname))) {
      handleTypeScript(pathname);
    } else if (extension(pathname) === ".scss") {
      if (pathname == join(source, "pages/global.scss")) {
        logmsg("global.scss get modified, retranspile children scss files")
        handleSubSassfiles(join(source, "/pages"))
      }
      else
        handleSass(pathname);
    }
    else {
      loginfo("Copy", relative(source, pathname));
      copyFileSync(pathname, dest);
    }
  } catch (error) {
    logerror("Error copying:", pathname, error);

  }
}

export function handleDelete(srcname) {
  const outname = srcname.replace(source, output)
    .replace(/\.(ts|tsx|jsx|js)$/i, ".js")
    .replace(/\.(scss|css)$/i, ".css");
  try {
    if (statSync(outname).isDirectory()) {
      rmSync(outname, { recursive: true, force: true });
      logmsg("Deleted directory:", relative(output, outname));
      return;
    }
    let extensions = null;
    if (/\.(ts|tsx|jsx|js)$/i.test(srcname)) extensions = [".ts", ".tsx", ".jsx", ".js"];
    else if (/\.(scss|css)$/i.test(srcname)) extensions = [".scss", ".css"];

    if (extensions) {
      const basePath = srcname.replace(/\.(ts|tsx|jsx|js|scss|css)$/i, "");
      if (extensions.some((ext) => existsSync(basePath + ext))) {
        logmsg("Skipping deletion, source exists:", basePath);
        return;
      }
    }
    unlinkSync(outname);
    loginfo("Deleted file:", relative(output, outname));
  } catch (error) {
    if (error.code === "ENOENT") {
      logerror("File or directory does not exist:", relative(output, outname));
    } else {
      logerror("Error deleting:", relative(output, outname), error);
    }
  }
}

export function handleTailwind() {
  if (GET("STYLE_EXTENTION") !== "tailwind") return;
  const inputCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
  const tailwindConfig = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extend: {} },
    plugins: [],
  }
  try {
    const tailwindPath = join(source, './pages/tailwind.css');
    const processor = postcss([tailwindcss(tailwindConfig)]);
    processor.process(inputCSS, { from: undefined }).then((result) => {
      writeFileSync(tailwindPath, result.css, 'utf-8');
    })
      .catch((err) => {
        throw new Error(`Error generating CSS: ${err.message}`);
      });
  } catch (err) {
    console.error(err.message);
  }

}

export function logServerMsg(port) {
  console.clear();
  console.log(`
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
\x1b[1m\x1b[32m    UraJS Development Server is Running!        \x1b[0m
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
\x1b[1m\x1b[32m    open http://localhost:${port}               \x1b[0m
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
    `);
}

let data = null;
export function parse_config_file() {
  try { data = JSON.parse(readFileSync(join(__dirname, "../config.json"))) }
  catch (error) { logerror("Error: opening config.json", error); process.exit(1); }
}

export const GET = (name) => {
  if (data == null) parse_config_file();
  return data[name];
}
export const SET = (name, value) => data[name] = value;

let routes = [];
let styles = [];
function generateRoutes(dir, parent, adding) {
  readdirSync(dir, { withFileTypes: true }).forEach(sub => {
    let tmp = adding;
    if (sub.isDirectory()) {
      const currRoute = `${parent}/${sub.name}`;
      if (adding) {
        let file = null;
        [".js", ".jsx", ".ts", ".tsx"].forEach((ext) => {
          const curr = join(dir, sub.name, `${sub.name}${ext}`);
          if (existsSync(curr)) {
            file = curr;
            return;
          }
        })
        if (file !== null)
          routes[currRoute] = `/pages${parent}/${sub.name}/${sub.name}.js`;
        else
          adding = false;
      }
      generateRoutes(join(dir, sub.name), currRoute, adding);
    }
    else if (sub.isFile() && /\.(css|scss)$/.test(sub.name))
      styles.push(`/pages${parent}/${basename(sub.name).replace(/\.(scss)$/i, ".css")}`)
    adding = tmp;
  })
}

export function updateRoutes() {
  if (!data["DIR_ROUTING"]) return;
  routes = {};
  styles = [];
  generateRoutes(join(source, "/pages"), "", true);
  let output = {
    routes,
    styles,
    base: GET("DEFAULT_ROUTE"),
    type: GET("TYPE") === "dev" ? "dev" : "build"
  }
  writeFileSync(join(source, "/pages/routes.json"), JSON.stringify(output, null, 2), "utf8");
  loginfo("Routes updated");
}

export function MimeType(ext) {
  return {
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
  }[ext] || "application/octet-stream";
}

