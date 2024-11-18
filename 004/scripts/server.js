import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import UTILS from "./utils.js";
const {
  GET,
  SET,
  INIT,
  CHECK_PORT,
  WATCH,
  DELETE,
  COPY,
  UPDATE_ROUTES,
  TYPE,
  LOG,
} = UTILS;

INIT();
SET("TYPE", "dev");
let server;
let wss;
const outDir = GET("OUTPUT");
const rootDir = GET("ROOT");
const srcDir = GET("SOURCE");
const timing = GET("SERVER_TIMING");
const dir_routing = GET("DIR_ROUTING");

if (dir_routing) UPDATE_ROUTES();

function convertToJs(filePath) {
  const ext = path.extname(filePath);
  if (ext === ".jsx" || ext === ".tsx" || ext === ".ts") {
    return filePath.replace(ext, ".js");
  }
  return filePath;
}

const createServer = (port) => {
  CHECK_PORT(port, (isInUse, availablePort, error) => {
    if (error) {
      console.error(`Error occurred: ${error.message}`);
      process.exit(1);
    } else {
      // console.log(`Starting server on port ${availablePort}...`);

      server = http.createServer((req, res) => {
        let reqPath = req.url.split("?")[0];
        let filePath = convertToJs(path.join(outDir, reqPath));
        if (reqPath === "/") filePath = path.join(rootDir, "index.html");
        fs.stat(filePath, (err, stats) => {
          console.log(
            "\x1b[36m%s\x1b[0m",
            "serve",
            path.relative(srcDir, filePath)
          );
          if (err) {
            // console.error(filePath, "Not found");
            // if (filePath.endsWith("pages/main.js"))
            //   filePath = path.join(rootDir, "./src/pages/main.js");
            // else
            filePath = path.join(rootDir, "./index.html");
            res.writeHead(200, {
              "Content-Type": TYPE(path.extname(filePath)),
            });
            fs.createReadStream(filePath).pipe(res);
            // res.writeHead(404, { "Content-Type": "text/plain" });
            // res.end(`${filePath} Not Found`);
          } else if (stats.isFile()) {
            res.writeHead(200, {
              "Content-Type": TYPE(path.extname(filePath)),
            });
            fs.createReadStream(filePath).pipe(res);
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
          }
        });
      });

      server.listen(availablePort, () => {
        LOG(availablePort);
      });

      // Create WebSocket server after HTTP server is ready
      wss = new WebSocketServer({ server });
      wss.on("connection", () => {
        // console.log("Client connected");
      });

      let notifyTimeout;
      function notifyClients(message) {
        if (notifyTimeout) clearTimeout(notifyTimeout);
        notifyTimeout = setTimeout(() => {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              if (message) {
                client.send(JSON.stringify(message));
              } else {
                console.warn("send reload");
                client.send(JSON.stringify({ action: "reload" }));
                LOG(availablePort);
              }
            }
          });
        }, timing || 1); // debouncing
      }

      WATCH(
        srcDir,
        ["add", "change", "unlink", "unlinkDir"],
        {},
        (_path, event) => {
          if (event === "unlink" || event === "unlinkDir" || !event) {
            // console.log(_path, "was deleted");
            DELETE(_path);
            if (dir_routing) UPDATE_ROUTES();
            notifyClients();
          } else if (event) {
            COPY(_path);
            if (/\.scss$|\.css$/.test(_path)) {
              _path = _path.replace(/\.scss$/, ".css");
              notifyClients({
                action: "update",
                filename: path.relative(srcDir, _path),
                type: "css",
              });
            }
            // else if (/\.(js|jsx|tsx|ts)$/.test(_path)) {
            //   console.log("notify client about js");
            //   notifyClients({
            //     action: "update",
            //     filename: "/routes.json",
            //     type: "json",
            //   });
            // }
            else notifyClients();
          }

          // notifyClients();
        }
      );

      WATCH(path.join(rootDir, "./index.html"), ["change"], {}, (param) => {
        console.log("index.html file changed");
        notifyClients();
      });
    }
  });
};

WATCH(path.join(rootDir, "./config.json"), ["change"], {}, (param) => {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "config.json file changed, restarting the server"
  );
  process.exit(1);
});

createServer(GET("PORT"));
