import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { fileURLToPath } from "url";
import chokidar from "chokidar";
import dotenv from "dotenv";
import updateRoutes from "./update-routes.js";
import { copyRecursive, deleteRecursive, copyFile } from "./handle-files.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @ts-ignore
const PORT = process.env.PORT || 5000;
const SRCDIR = path.resolve(__dirname, "../src");
const OUTDIR = path.resolve(__dirname, "../out");

deleteRecursive(OUTDIR);
copyRecursive(SRCDIR, OUTDIR);
updateRoutes();


const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "audio/ogg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".zip": "application/zip",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".bz2": "application/x-bzip2",
  ".xz": "application/x-xz",
};

const getMimeType = (ext) => mimeTypes[ext] || "application/octet-stream";

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  let newPath = path.join(OUTDIR, reqPath);

  const ext = path.extname(newPath);
  if (reqPath == "/") newPath = path.join(SRCDIR, "../index.html");

  fs.stat(newPath, (err, stats) => {
    console.log("serve", newPath);
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`${newPath} Not Found`);
    } else if (stats.isFile()) {
      const contentType = getMimeType(path.extname(newPath));
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(newPath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });
wss.on("connection", () => {
  console.log("Client connected");
});

let notifyTimeout;
const notifyClients = () => {
  if (notifyTimeout) clearTimeout(notifyTimeout);
  notifyTimeout = setTimeout(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("send refresh");
        client.send("refresh");
      }
    });
    // @ts-ignore
  }, process.env.SERVER_TIMING || 1); // Adjust debounce time as needed
};

function Watcher(path, events, param, callback) {
  const watch = chokidar.watch(path, param || {});
  events.forEach((event) => {
    watch.on(event, callback);
  });
  watch.on("error", (error) => console.error(`Watcher error: ${error}`));
  // Optionally log when Chokidar starts watching files
  console.log(`Started watching: ${path}`);
}

// Watch source directory
Watcher(SRCDIR, ["add", "change", "unlink", "unlinkDir"], {}, (eventPath, event) => {
  if (event === "unlink" || event === "unlinkDir" || !event) {
    const destPath = eventPath.replace(SRCDIR, OUTDIR);
    console.log(`${eventPath.replace(SRCDIR, ".")} was deleted`);

    // Handle file or directory deletion
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true }); // Delete corresponding file or directory in OUTDIR
      console.log(`${destPath.replace(OUTDIR, ".")} removed from output`);
    }
    updateRoutes();
  } else if (event) {
    // console.log("event on", eventPath);
    // Handle added or changed files
    copyFile(eventPath);
    console.log("copy", eventPath.replace(SRCDIR, "."));
  }
  notifyClients();
});

// Watcher(path.join(__dirname, "../index.html"), ["change"], {}, (param) => {
//   // copyFile(param);
//   console.log("index.html file changed");
//   notifyClients();
// });

// Watcher(path.join(__dirname, "../.env"), ["change"], {}, (param) => {
//   // copyFile(param);
//   console.log("env file changed");
//   notifyClients();
// });

// Watcher(path.join(OUTDIR, "/**/*.js"), ["change"], {}, (param) => {
//   console.log(param.replace(OUTDIR, "."), "JS file changed");
//   notifyClients();
// });
