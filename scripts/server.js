import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import chokidar from "chokidar";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 17000;
const SRCDIR = path.resolve(__dirname, "../src");
const OUTDIR = path.resolve(__dirname, "../out");

const copyRecursive = (srcDir, outDir) => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.readdirSync(srcDir).forEach((pathname) => {
    const srcFile = path.join(srcDir, pathname);
    const outFile = path.join(outDir, pathname);

    if (fs.statSync(srcFile).isDirectory()) {
      copyRecursive(srcFile, outFile);
    } else if (!/\.ts$|\.tsx$|\.jsx$|\.js$/.test(pathname)) {
      fs.copyFileSync(srcFile, outFile);
    }
  });
};

spawn("npm", ["run", "update"], {
  stdio: "inherit", // This will inherit the output (logs) to the main process
  shell: true, // Run in shell mode to allow execution on Windows
});

// Copy files before the server starts
copyRecursive(SRCDIR, OUTDIR);

const copyFile = (srcPath) => {
  if (!/\.(ts|tsx|jsx|js)$/i.test(srcPath)) {
    const destPath = srcPath.replace(SRCDIR, OUTDIR);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
};

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
  // console.log("request path:", reqPath);
  // console.log("new path:", newPath);

  // If the path has no extension (e.g., /user), serve index.html
  const ext = path.extname(newPath);
  if (!ext) newPath = path.join(SRCDIR, "../index.html"); // Default to index.html

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

wss.on("connection", (ws) => {
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
  }, 1); // Adjust debounce time as needed
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
Watcher(
  SRCDIR,
  ["add", "change", "unlink", "unlinkDir"],
  { ignored: /\.js$|\.jsx$|\.ts$|\.tsx$/i },
  (eventPath, event) => {
    if (event === "unlink" || event === "unlinkDir" || !event) {
      const destPath = eventPath.replace(SRCDIR, OUTDIR);
      console.log(`${eventPath.replace(SRCDIR, ".")} was deleted`);

      // Handle file or directory deletion
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true }); // Delete corresponding file or directory in OUTDIR
        console.log(`${destPath.replace(OUTDIR, ".")} removed from output`);
      }
      spawn("npm", ["run", "update"], {
        stdio: "inherit", // This will inherit the output (logs) to the main process
        shell: true, // Run in shell mode to allow execution on Windows
      });
    } else if (event) {
      // console.log(event);

      // Handle added or changed files
      copyFile(eventPath);
      console.log(eventPath.replace(SRCDIR, "."), "file changed");
    }
    notifyClients();
  }
);

Watcher(path.join(__dirname, "../index.html"), ["change"], {}, (param) => {
  // copyFile(param);
  console.log("index.html file changed");
  notifyClients();
});

Watcher(path.join(__dirname, "../.env"), ["change"], {}, (param) => {
  // copyFile(param);
  console.log("index.html file changed");
  notifyClients();
});

// Watch output directory
Watcher(OUTDIR + "/**/*.js", ["change"], {}, (param) => {
  console.log(param.replace(OUTDIR, "."), "JS file changed");
  notifyClients();
});

// Fork a child process to run tsc -w (TypeScript compiler in watch mode)
// const tscProcess = spawn("tsc", ["-w"], {
//   stdio: "inherit", // This will inherit the output (logs) to the main process
//   shell: true, // Run in shell mode to allow execution on Windows
// });

// // Handle any errors or events from the tsc child process
// tscProcess.on("error", (error) => {
//   console.error(`Error spawning tsc process: ${error.message}`);
// });

// tscProcess.on("close", (code) => {
//   console.log(`tsc process exited with code ${code}`);
// });
