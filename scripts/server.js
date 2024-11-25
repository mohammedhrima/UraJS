import { join, relative, extname as extension, } from "path";
import { statSync, rmSync, existsSync, readdirSync, stat, createReadStream } from "fs";
import net from "net"
import http from "http";
import chokidar from "chokidar"
import { parse_config_file, source, output, root, handleDelete, updateRoutes, handleCopy, GET, SET, logServerMsg, MimeType } from "./utils.js";
import { logerror, loginfo, logmsg } from "./debug.js";
import { WebSocketServer, WebSocket } from "ws";

// CLEAR out Directory
if (existsSync(output)) readdirSync(output).forEach(sub => {
  let _path = join(output, sub);
  if (statSync(_path).isDirectory()) rmSync(_path, { recursive: true, force: true })
  else rmSync(_path)
});

parse_config_file();
if (GET("STYLE_EXTENTION") !== "tailwind" && existsSync(join(source, "./pages/tailwind.css")))
  rmSync(join(source, "./pages/tailwind.css"))
SET("TYPE", "dev");
updateRoutes()

async function getAvailablePort(port) {
  const isAvailable = (port) =>
    new Promise((resolve) => {
      const server = net.createServer({ reuseAddress: true });
      server.once("error", () => resolve(false));
      server.once("listening", () => server.close(() => resolve(true)));
      server.listen(port);
    });

  while (!(await isAvailable(port))) {
    console.log(`Port ${port} is in use, trying port ${++port}...`);
  }
  return port;
}

async function createServer() {
  let port = await getAvailablePort(GET("PORT"));

  let server = http.createServer((req, res) => {
    let uri = req.url.split("?")[0];

    if (uri === "/") uri = join(root, "index.html");
    else if (uri.startsWith("/node_modules/")) {
      loginfo("requesting from node_modules", uri);
      uri = join(root, uri)
    }
    else
      uri = join(output, uri);

    if ([".jsx", ".tsx", ".ts"].includes(extension(uri))) {
      uri = uri.replace(extension(uri), ".js");
    }

    stat(uri, (err, stats) => {
      logmsg("serve", relative(output, uri));
      if (err) {
        logerror(
          uri,
          "Not found!\n",
          "If it's a js|jsx|ts|tsx file\n",
          "make sure to import it like this 'file/path.(js|jsx|ts|tsx)'"
        );
        uri = join(root, "index.html");
        res.writeHead(200, { "Content-Type": MimeType(extension(uri)) });
        createReadStream(uri).pipe(res);
      } else if (stats.isFile()) {
        res.writeHead(200, { "Content-Type": MimeType(extension(uri)) });
        createReadStream(uri).pipe(res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });
  });

  server.listen(port, () => {
    logServerMsg(port);
  });

  const wss = new WebSocketServer({ server });
  wss.on("connection", (socket) => { /* sockets.add(socket) */ });

  let timeout = null;
  function notifyClient(message) {
    // console.log("emit event");
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message));
      });
    }, GET("SERVER_TIMING") || 1);
  }

  function watch_path(watchPath, events, callback) {
    const watch = chokidar.watch(watchPath, {});
    events.forEach((event) => watch.on(event, callback));
    watch.on("error", (error) => console.error(`watch_path error: ${error}`));
  }

  watch_path(source, ["add", "change"], (pathname, event) => {
    if (event) {
      let message = null;
      handleCopy(pathname);
      if (pathname !== join(source, "/pages/tailwind.css") && [".scss", ".css"].includes(extension(pathname))) message = { action: "update", filename: relative(source, pathname), type: "css" }
      else message = { action: "reload" };
      // console.log("> ", event);
      if (([".js", ".jsx", ".ts", ".tsx"].includes(extension(pathname)))) {
        updateRoutes();
        message = { action: "reload" };
      }
      notifyClient(message)
    }
  })
  watch_path(source, ["unlink", "unlinkDir"], (pathname, event) => {
    // if (event) {
    handleDelete(pathname);
    updateRoutes();
    notifyClient();
    // }
  })


  const arr = ["index.html", "config.json"].forEach(elem => {
    watch_path(join(root, elem), ["change"], async () => {
      if (elem === "config.json") {
        logerror("config.json did changed restart the server");
        process.exit(0);
      }
      else
        loginfo(elem, "changed");
      notifyClient({ action: "reload" });
    })
  })
  return server;
}

createServer();