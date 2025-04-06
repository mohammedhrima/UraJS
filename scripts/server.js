#!/usr/bin/env node
import { join, extname as extension, relative } from "path";
import net from "net";
import express from "express";
import { output as outdir, source, config, updateRoutes, handleCopy, handleDelete } from "./utils.js";
import { statSync, rmSync, existsSync, readdirSync, promises, mkdirSync } from "fs";
import http from "http";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";
import { logerror, loginfo, logmsg, logwarn } from "./debug.js";

function get_file(uri) {
  let filePath = join(outdir, uri);
  if (existsSync(filePath)) return filePath;

  let ext = extension(uri);
  if ([".jsx", ".tsx", ".ts"].includes(ext)) {
    let newUri = uri.replace(ext, ".js");
    let newFilePath = join(outdir, newUri);
    if (existsSync(newFilePath)) return newFilePath;
  }

  logerror(filePath, "Not found");
  return join(outdir, "index.html");
}

function create_request(action, pathname) {
  return JSON.stringify({ action: action, pathname: relative(source, pathname), ext: extension(pathname) });
}

const debounceTimers = new Map();
const pendingDeletions = new Set();

function watch_path(watchPath, events, callback) {
  const watcher = chokidar.watch(watchPath, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    },
    persistent: true,
    usePolling: false, // Set to true if watching over network
    atomic: true // Handle atomic saves properly
  });

  events.forEach((event) => {
    watcher.on(event, async (pathname) => {
      if ((event === 'unlink' || event === 'unlinkDir') && pendingDeletions.has(pathname)) {
        return;
      }
      if (event === 'unlink' || event === 'unlinkDir') {
        pendingDeletions.add(pathname);
      }
      if (debounceTimers.has(pathname)) {
        clearTimeout(debounceTimers.get(pathname));
        debounceTimers.delete(pathname);
      }
      debounceTimers.set(pathname, setTimeout(async () => {
        try {
          if (event === 'unlink' || event === 'unlinkDir') {
            const outputPath = pathname.replace(source, outdir);
            try {
              await promises.access(outputPath);
              // loginfo("Processing deletion:", pathname);
              await callback(pathname, event);
            } catch (err) {
              if (err.code === 'ENOENT') {
                // loginfo("File already deleted, skipping:", pathname);
              } else {
                // throw err;
                logerror("watch_path: ", err)
              }
            }
          } else {
            // loginfo("Processing change:", event, pathname);
            await callback(pathname, event);
          }
        } catch (error) {
          logerror(`processing ${event} for ${pathname}:`, error);
        } finally {
          debounceTimers.delete(pathname);
          pendingDeletions.delete(pathname);
        }
      }, event === 'unlink' || event === 'unlinkDir' ? 50 : 100))
    });
  });
  watcher.on("error", (error) => logerror(`watch_path error: ${error}`));
  return watcher;
}

let currSocket = null;
function open_websocket(app) {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    loginfo("WebSocket connected");
    socket.on("message", (message) => {
      logmsg("Received:", message.toString());
    });
    socket.on("close", () => {
      logerror("WebSocket disconnected");
    });
    currSocket = socket;
  });

  watch_path(source, ["add", "addDir", "change", "unlink", "unlinkDir"], async (pathname, event) => {
    try {
      switch (event) {
        case "add": case "addDir": case "change": {
          await handleCopy(pathname);
          currSocket?.send(create_request("update", pathname));
          break;
        }
        case "unlink": case "unlinkDir": {
          await handleDelete(pathname)
          updateRoutes();
          currSocket?.send(create_request("reload"));
          break;
        }
        default:
          logwarn("handle ", event);
          break;
      }
    } catch (error) {
      logerror("watch:path:callback", error);
    }
  });
  return server;
}

function createServer(port) {
  const app = express();
  open_websocket(app);

  // app.use(express.static(outdir));
  app.get(["/*path", "/"], (req, res) => {
    let pathname = get_file(req.path);
    logmsg("send", pathname.replace(outdir, ""))
    res.sendFile(pathname);
  });
  const server = open_websocket(app);

  server.listen(port, () => {
    // console.clear();
    console.log(`
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
\x1b[1m\x1b[32m    UraJS Development Server is Running!        \x1b[0m
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
\x1b[1m\x1b[32m    open http://localhost:${port}               \x1b[0m
\x1b[1m\x1b[32m--------------------------------------------------\x1b[0m
      `);
  });
}

async function startServer(startPort = 17000) {
  const server = net.createServer();
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(startPort, () => resolve());
    });
    const port = server.address().port;
    await new Promise((resolve) => server.close(resolve));
    createServer(port);
  } catch (err) {
    await new Promise((resolve) => server.close(resolve));

    if (err.code === "EADDRINUSE") {
      return await startServer(startPort + 1);
    }
    throw err;
  }
}

(async () => {
  const holder = await import("../ura.config.js")
  await holder.default()

  if (existsSync(outdir))
    readdirSync(outdir).forEach((sub) => {
      let _path = join(outdir, sub);
      if (statSync(_path).isDirectory()) rmSync(_path, { recursive: true, force: true });
      else rmSync(_path);
    });

  if (config.tailwind !== "enable" && existsSync(join(source, "./pages/tailwind.css"))) {
    rmSync(join(source, "./pages/tailwind.css"));
  }

  updateRoutes();
  handleCopy(source);
  await startServer(17000);
})();
