#!/usr/bin/env node
import { join, extname as extension, relative } from "path";
import net from "net";
import express from "express";
import { output as outdir, source, config, updateRoutes, handleCopy, handleDelete, root } from "./utils.js";
import { statSync, rmSync, existsSync, readdirSync, promises, mkdirSync } from "fs";
import http from "http";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";
import { logerror, loginfo, logmsg, logwarn } from "./debug.js";

function get_file(uri: string): string {
  let filePath = join(outdir, uri);
  if (existsSync(filePath)) return filePath;

  let ext = extension(uri);
  
  if ([".jsx", ".tsx", ".ts"].includes(ext)) {
    let newUri = uri.replace(ext, ".js");
    let newFilePath = join(outdir, newUri);
    if (existsSync(newFilePath)) return newFilePath;
  }

  if (!ext || ext === uri) {
    let jsFilePath = filePath + ".js";
    if (existsSync(jsFilePath)) return jsFilePath;
  }

  logerror(filePath, "Not found");
  return join(outdir, "index.html");
}

function create_request(action: string, pathname: string): string {
  return JSON.stringify({ action: action, pathname: relative(source, pathname), ext: extension(pathname) });
}

const debounceTimers = new Map<string, NodeJS.Timeout>();
const pendingDeletions = new Set<string>();

function watch_path(watchPath: string, events: string[], callback: (pathname: string, event: string) => Promise<void>): any {
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
    (watcher as any).on(event, async (pathname: string) => {
      if ((event === 'unlink' || event === 'unlinkDir') && pendingDeletions.has(pathname)) {
        return;
      }
      if (event === 'unlink' || event === 'unlinkDir') {
        pendingDeletions.add(pathname);
      }
      if (debounceTimers.has(pathname)) {
        clearTimeout(debounceTimers.get(pathname)!);
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
            } catch (err: any) {
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
  (watcher as any).on("error", (error: any) => logerror(`watch_path error: ${error}`));
  return watcher;
}

let currSocket: any = null;
function open_websocket(app: any): http.Server {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: any) => {
    loginfo("WebSocket connected");
    socket.on("message", (message: Buffer) => {
      logmsg("Received:", message.toString());
    });
    socket.on("close", () => {
      logerror("WebSocket disconnected");
    });
    currSocket = socket;
  });

  watch_path(source, ["add", "addDir", "change", "unlink", "unlinkDir"], async (pathname: string, event: string) => {
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
          currSocket?.send(create_request("reload", ""));
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

function createServer(port: number): http.Server {
  const app = express() as any;
  const server = open_websocket(app);

  // app.use(express.static(outdir));
  app.get(["/*path", "/"], (req: any, res: any) => {
    let pathname = get_file(req.path);
    logmsg("send", pathname.replace(outdir, ""))
    res.sendFile(pathname);
  });

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
  return server;
}

async function startServer(startPort: number = 17000): Promise<void> {
  const server = net.createServer();
  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(startPort, () => resolve());
    });
    const port = (server.address() as net.AddressInfo).port;
    await new Promise<void>((resolve) => server.close(() => resolve()));
    createServer(port);
  } catch (err: any) {
    await new Promise<void>((resolve) => server.close(() => resolve()));

    if (err.code === "EADDRINUSE") {
      return await startServer(startPort + 1);
    }
    throw err;
  }
}

(async () => {
  const holder = await import(join(root, "ura.config.js"))
  await holder.default()

  if (existsSync(outdir))
    readdirSync(outdir).forEach((sub) => {
      let _path = join(outdir, sub);
      if (statSync(_path).isDirectory()) rmSync(_path, { recursive: true, force: true });
      else rmSync(_path);
    });

  if (config.styling !== "Tailwind CSS" && existsSync(join(source, "./pages/tailwind.css"))) {
    rmSync(join(source, "./pages/tailwind.css"));
  }

  updateRoutes();
  handleCopy(source);
  await startServer(17000);
})();
