import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import chokidar from "chokidar";
import updateRoutes from "./update-routes.js";
import { deleteRecursive, copyFile } from "./handle-files.js";
import { ROOTDIR, OUTDIR, SRCDIR, CONFIG , getMimeType} from "./utils.js";

const PORT = CONFIG.PORT || 17000;

deleteRecursive(OUTDIR);
// copyRecursive(SRCDIR, OUTDIR);
updateRoutes();
// console.clear();

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  let filePath = path.join(OUTDIR, reqPath);

  if (reqPath == "/") filePath = path.join(ROOTDIR, "index.html");
  fs.stat(filePath, (err, stats) => {
    console.log("serve", path.relative(ROOTDIR, filePath));
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`${filePath} Not Found`);
    } else if (stats.isFile()) {
      const contentType = getMimeType(path.extname(filePath));
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
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
function notifyClients() {
  if (notifyTimeout) clearTimeout(notifyTimeout);
  notifyTimeout = setTimeout(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("send refresh");
        client.send("refresh");
      }
    });
  }, CONFIG.SERVER_TIMING || 1); // Adjust debounce time as needed
}

function Watcher(watchPath, events, param, callback) {
  const watch = chokidar.watch(watchPath, param || {});
  events.forEach((event) => {
    watch.on(event, callback);
  });
  watch.on("error", (error) => console.error(`Watcher error: ${error}`));
  console.log(`Started watching: ${path.relative(ROOTDIR, watchPath)}`);
}

Watcher(SRCDIR, ["add", "change", "unlink", "unlinkDir"], {}, (eventPath, event) => {
  if (event === "unlink" || event === "unlinkDir" || !event) {
    const destPath = eventPath.replace(SRCDIR, OUTDIR);
    console.log(`${path.relative(SRCDIR, eventPath)} was deleted`);
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
      console.log(`${path.relative(OUTDIR, destPath)} removed from output`);
    }
    updateRoutes();
  } else if (event) copyFile(eventPath);
  notifyClients();
});

Watcher(path.join(ROOTDIR, "index.html"), ["change"], {}, (param) => {
  console.log("index.html file changed");
  notifyClients();
});

