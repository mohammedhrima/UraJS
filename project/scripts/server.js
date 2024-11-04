import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import UTILS from "./utils.js";
const { GET, INIT, CHECK_PORT, WATCH, DELETE, COPY, UPDATE_ROUTES, TYPE } = UTILS;

const outDir = GET("OUTPUT");
const rootDir = GET("ROOT");
const srcDir = GET("SOURCE");
const timing = GET("SERVER_TIMING");


UPDATE_ROUTES();
INIT();

const createServer = (port) => {
  CHECK_PORT(port, (isInUse, availablePort, error) => {
    if (error) {
      console.error(`Error occurred: ${error.message}`);
      process.exit(1);
    }
    else {
      console.log(`Starting server on port ${availablePort}...`);

      let server = http.createServer((req, res) => {
        let reqPath = req.url.split("?")[0];
        let filePath = path.join(outDir, reqPath);
        if (reqPath === "/") filePath = path.join(rootDir, "index.html");
        fs.stat(filePath, (err, stats) => {
          console.log("serve", path.relative(srcDir, filePath));
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end(`${filePath} Not Found`);
          } else if (stats.isFile()) {
            res.writeHead(200, { "Content-Type": TYPE(path.extname(filePath)) });
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
              client.send("reload");
            }
          });
        }, timing || 1); // debouncing
      }

      WATCH(srcDir, ["add", "change", "unlink", "unlinkDir"], {}, (_path, event) => {
        if (event === "unlink" || event === "unlinkDir" || !event) {
          console.log(_path, "was deleted");
          DELETE(_path)
          UPDATE_ROUTES();
        }
        else if (event) {
          COPY(_path)
        }
        notifyClients();
      });

      WATCH(path.join(rootDir, "./index.html"), ["change"], {}, (param) => {
        console.log("index.html file changed");
        notifyClients();
      });

      WATCH(path.join(rootDir, "./config.json"), ["change"], {}, (param) => {
        console.error("config.json file changed restart the server");
        process.exit(1);
      });

    }
  })
}

createServer(GET("PORT"));
