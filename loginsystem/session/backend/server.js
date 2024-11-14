const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express();
const db = new sqlite3.Database(":memory:"); // In-memory DB for simplicity

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5501",
    credentials: true,
  })
);

app.use(cookieParser());

// Initialize users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`);

const sessions = new Map(); // For session storage

// Register a new user
app.post("/register", async (req, res) => {
  console.log("response to register");
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, hashedPassword, "user"],
    (err) => {
      if (err) return res.status(400).send("Error: User already exists");
      res.send("User registered successfully");
    }
  );
});

// Login user
app.post("/login", (req, res) => {
  console.log("response to login");
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err || !user) return res.status(401).send("Error: Invalid username or password");
      
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return res.status(401).send("Error: Invalid username or password");

      // Generate session ID and store it
      const sessionId = crypto.randomUUID();
      sessions.set(sessionId, user);

      res
        .cookie("sessionId", sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send("Logged in successfully");
    }
  );
});

// Logout user
app.post("/logout", (req, res) => {
  console.log("response to logout");
  const sessionId = req.cookies.sessionId;
  sessions.delete(sessionId);
  res.clearCookie("sessionId").send("Logged out successfully");
});

// Protected route
app.get("/data", (req, res) => {
  console.log("response to data");
  const sessionId = req.cookies.sessionId;
  const user = sessions.get(sessionId);

  if (!user) {
    return res.status(401).send("Error: Unauthorized - Please log in");
  }
  res.send(`Welcome, ${user.username}! You have access to protected data.`);
});

app.get("/close", ()=>{
  console.log("response to close");
  console.log("close window");
  
})

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
