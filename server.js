const fs = require("fs");
const _path = require("path");
const swc = require("@swc/core");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config();

function relativePath(path) {
  return _path.relative(process.cwd(), path);
}

// Webserving
const PORT = process.env.PORT || 5000;
const serveStaticFile = (path, contentType, res) => {
  console.log("serve", relativePath(path));
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error("file not found", relativePath(path));
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
};

const server = http.createServer((req, res) => {
  console.log("send ", req.url);
  if (req.method === "GET" && req.url === "/") {
    const indexPath = _path.resolve(__dirname, "./dist/pages/index.html");
    serveStaticFile(indexPath, "text/html", res);
  } else if (req.method === "GET") {
    let path;
    if (req.url == "Mini") path = _path.resolve(__dirname, "./Mini/lib.js");
    else path = _path.resolve(__dirname, "." + "/dist/" + req.url);
    const ext = _path.extname(path);
    let contentType = "text/plain";
    switch (ext) {
      case ".js":
      case ".ts":
        contentType = "application/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".html":
        contentType = "text/html";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }
    serveStaticFile(path, contentType, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const wss = new WebSocket.Server({ server });

function refresh() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("refresh");
    }
  });
}
// Transpilation
function removeComments(code) {
  return code;
  // return code.replace(/\/\*\*?[\s\S]*?\*\/|\/\/.*/g, "");
}

function transpileFile(path) {
  const content = fs.readFileSync(path, "utf8");
  swc
    .transform(content, {
      filename: _path.basename(path),
      jsc: {
        parser: {
          syntax: "ecmascript",
          jsx: true,
          dynamicImport: true,
        },
        transform: {
          react: {
            pragma: "Mini.createElement",
            pragmaFrag: "Mini.Fragment",
          },
        },
        target: "es2015",
      },
    })
    .then((result) => {
      let transpiledCode = removeComments(result.code);
      const distPath = path.replace(/src/, "dist");
      const distDir = _path.dirname(distPath);
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
      fs.writeFileSync(distPath, transpiledCode);
      console.log(`Transpiled to ${relativePath(distPath)}`);
      refresh();
    })
    .catch((err) => {
      console.error(`Error transpiling ${path}:`, err);
    });
}

function copyFile(src, dest) {
  const destDir = _path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`Copied to ${relativePath(dest)}`);
  refresh();
}

function deleteFile(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    console.log(`Deleted ${relativePath(path)}`);
    refresh();
  }
}

function deleteDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.rmdirSync(directoryPath, { recursive: true });
    console.log(`Deleted directory ${relativePath(directoryPath)}`);
    refresh();
  }
}

function watchFile(path) {
  console.log("watch file", path);
  let timeout;
  fs.watch(path, (eventType, filename) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log(relativePath(path), "has been modified.");
      if (!fs.existsSync(path)) {
        deleteFile(path.replace(/src/, "dist"));
      } else {
        const ext = _path.extname(path);
        switch (ext) {
          case ".js":
          case ".ts":
            transpileFile(path);
            break;
          default:
            copyFile(path, path.replace(/src/, "dist"));
            break;
        }
      }
    }, process.env.TIMING || 10);
  });
}

function watchDirectory(directoryPath) {
  console.log("watch directory", directoryPath);
  let timeout;
  fs.watch(directoryPath, { recursive: true }, (eventType, filename) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log(relativePath(directoryPath), "directory modified");
      if (filename) {
        const fullPath = _path.join(directoryPath, filename);
        if (!fs.existsSync(fullPath)) {
          if (fs.lstatSync(fullPath).isDirectory()) {
            deleteDirectory(fullPath.replace(/src/, "dist"));
          } else {
            deleteFile(fullPath.replace(/src/, "dist"));
          }
        } else {
          if (fs.lstatSync(fullPath).isDirectory()) {
            watchDirectory(fullPath);
          } else {
            watchFile(fullPath);
            const ext = _path.extname(fullPath);
            switch (ext) {
              case ".js":
              case ".ts":
                transpileFile(fullPath);
                break;
              default:
                copyFile(fullPath, fullPath.replace(/src/, "dist"));
                break;
            }
          }
        }
      }
    }, process.env.TIMING || 10);
  });
}

function syncDirectories(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.readdir(srcDir, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    items.forEach((item) => {
      const srcPath = _path.join(srcDir, item.name);
      const destPath = _path.join(destDir, item.name);

      if (item.isDirectory()) {
        syncDirectories(srcPath, destPath);
      } else {
        if (!fs.existsSync(destPath)) {
          const ext = _path.extname(srcPath);
          switch (ext) {
            case ".js":
            case ".ts":
              transpileFile(srcPath);
              break;
            default:
              copyFile(srcPath, destPath);
              break;
          }
        } else {
          const srcStats = fs.statSync(srcPath);
          const destStats = fs.statSync(destPath);
          if (srcStats.mtime > destStats.mtime) {
            const ext = _path.extname(srcPath);
            switch (ext) {
              case ".js":
              case ".ts":
                transpileFile(srcPath);
                break;
              default:
                copyFile(srcPath, destPath);
                break;
            }
          }
        }
      }
    });
  });
}
const srcDirectory = _path.resolve(__dirname, "./src");
const destDirectory = _path.resolve(__dirname, "./dist");
syncDirectories(srcDirectory, destDirectory);
watchDirectory(srcDirectory);

wss.on("connection", (ws) => {
  console.log("Client connected");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
