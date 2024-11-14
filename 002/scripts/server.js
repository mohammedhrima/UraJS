import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import chokidar from "chokidar";
import updateRoutes from "./update-routes.js";
import { deleteRecursive, copyFile } from "./handle-files.js";
import { ROOTDIR, OUTDIR, SRCDIR, GET_CONFIG, getMimeType } from "./utils.js";
import net from "net";

let PORT = GET_CONFIG().PORT || 17000;
deleteRecursive(OUTDIR);
updateRoutes();

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

function Watcher(watchPath, events, param, callback) {
  const watch = chokidar.watch(watchPath, param || {});
  events.forEach((event) => {
    watch.on(event, callback);
  });
  watch.on("error", (error) => console.error(`Watcher error: ${error}`));
  console.log(`Started watching: ${path.relative(ROOTDIR, watchPath)}`);
}

function createServer(port) {
  checkPortInUse(port, (isInUse, availablePort, error) => {
    if (error) {
      console.error(`Error occurred: ${error.message}`);
      process.exit(1);
    } else {
      console.log(`Starting server on port ${availablePort}...`);

      let server = http.createServer((req, res) => {
        let reqPath = req.url.split("?")[0];
        let filePath = path.join(OUTDIR, reqPath);

        if (reqPath === "/") filePath = path.join(ROOTDIR, "index.html");
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

      server.listen(availablePort, () => {
        console.log(`Server running on port ${availablePort}`);
      });

      // Create WebSocket server after HTTP server is ready
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
              console.warn("send reload");
              client.send("mini-reload");
            }
          });
        }, GET_CONFIG().SERVER_TIMING || 1); // Adjust debounce time as needed
      }

      Watcher(
        SRCDIR,
        ["add", "change", "unlink", "unlinkDir"],
        {},
        (eventPath, event) => {
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
        }
      );

      Watcher(path.join(ROOTDIR, "index.html"), ["change"], {}, (param) => {
        console.log("index.html file changed");
        notifyClients();
      });
      Watcher(path.join(ROOTDIR, "config.json"), ["change"], {}, (param) => {
        console.error("config.json file changed restart the server");
        // notifyClients();
        process.exit(1);
      });
    }
  });
}

createServer(PORT);
