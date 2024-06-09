const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");

// Define the port
const PORT = 5000;

const serveStaticFile = (filePath, contentType, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
};

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const indexPath = path.resolve(__dirname, "index.html");
    serveStaticFile(indexPath, "text/html", res);
  } else if (req.method === "GET" && req.url.startsWith("/static/")) {
    const filePath = path.resolve(__dirname, "." + req.url);
    const ext = path.extname(filePath);
    let contentType = "text/plain";
    switch (ext) {
      case ".js":
        contentType = "application/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".html":
        contentType = "text/html";
        break;
    }
    serveStaticFile(filePath, contentType, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const wss = new WebSocket.Server({ server });

function listenOnChange(filePath) {
  fs.watch(filePath, (eventType, filename) => {
    if (eventType === "change") {
      console.log(filePath, "has been modified.");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("refresh");
        }
      });
    }
  });
}

listenOnChange(path.resolve(__dirname, "static", "index.js"));
listenOnChange(path.resolve(__dirname, "static", "index.css"));
listenOnChange(path.resolve(__dirname, "index.html"));

wss.on("connection", (ws) => {
  console.log("Client connected");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
