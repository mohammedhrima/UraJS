const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 5000;

const serveStaticFile = (filePath, contentType, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("file not found", filePath);
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
    const indexPath = path.resolve(__dirname, "./index.html");
    serveStaticFile(indexPath, "text/html", res);
  } else if (req.method === "GET") {
    let filePath;
    if (req.url == "/Mini/lib.js")
      filePath = path.resolve(__dirname, "." + req.url);
    else filePath = path.resolve(__dirname, "." + "/dist/" + req.url);
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
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }
    serveStaticFile(filePath, contentType, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("Client connected");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
