// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const SESSION_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds

app.use(express.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://localhost:5501"],
    credentials: true,
  })
);
app.use(cookieParser());

// Initialize SQLite database
const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  db.run("INSERT INTO users (username, password, role) VALUES ('user1', 'pass1', 'admin')");
  db.run("INSERT INTO users (username, password, role) VALUES ('user2', 'pass2', 'user')");
  db.run("INSERT INTO users (username, password, role) VALUES ('user3', 'pass3', 'user')");
});

const sessions = new Map();

function createSession(user) {
  const sessionId = crypto.randomUUID();
  const expiration = Date.now() + SESSION_TIMEOUT;
  sessions.set(sessionId, { user, expiration });
  return sessionId;
}

function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session && Date.now() > session.expiration) {
    sessions.delete(sessionId);
    return null; // Session expired
  }
  if (session) {
    session.expiration = Date.now() + SESSION_TIMEOUT; // Reset expiration on activity
  }
  return session;
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
    if (err || !user) {
      res.status(401).send("Unauthorized - Invalid username or password");
      return;
    }
    const sessionId = createSession(user);
    res
      .cookie("sessionId", sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .send(`Authenticated as ${user.username}`);
  });
});

app.get("/data", (req, res) => {
  const session = getSession(req.cookies.sessionId);
  if (!session) {
    res.status(401).send("Unauthorized - Session expired or invalid");
    return;
  }
  if (session.user.role !== "admin") {
    res.status(403).send("Forbidden - Admin access required");
    return;
  }
  res.status(200).send("Admin data accessed successfully!");
});

app.post("/logout", (req, res) => {
  sessions.delete(req.cookies.sessionId);
  res.clearCookie("sessionId").send("Logged out successfully");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
