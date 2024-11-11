const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto"); // Import crypto

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://127.0.0.1:5501/0.to_learn/auth/", "http://localhost:5501"],
    credentials: true,
  })
);

app.use(cookieParser());

const users = new Map();
users.set("user1", { id: 1, username: "user1", role: "admin" });
users.set("user2", { id: 2, username: "user2", role: "user" });
users.set("user3", { id: 3, username: "user3", role: "user" });

const sessions = new Map();

app.post("/login", (req, res) => {
  const user = users.get(req.body.username);
  if (!user) {
    res.status(401).send("Error: Unauthorized - User not found");
    return;
  }
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, user);
  res
    .cookie("sessionId", sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .send(`Authenticated as ${user.username}`);
});

app.get("/data", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const user = sessions.get(sessionId);

  if (!user) {
    res.status(401).send("Error: Unauthorized - No active session");
    return;
  }

  if (user.role !== "admin") {
    res.status(403).send("Error: Forbidden - Admin access required");
    return;
  }

  res.status(200).send("Admin data accessed successfully!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
