const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize DB connection
async function initDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log("✅ Database connected");
  }
}

// Routes
app.get("/tasks", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM task WHERE is_completed = FALSE ORDER BY created_at DESC LIMIT 5"
  );
  res.json(rows);
});

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  await db.execute("INSERT INTO task (title, description) VALUES (?, ?)", [
    title,
    description,
  ]);
  res.json({ message: "Task created successfully" });
});

app.get("/tasks/all", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM task ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.patch("/tasks/:id/done", async (req, res) => {
  const { id } = req.params;
  await db.execute("UPDATE task SET is_completed = TRUE WHERE id = ?", [id]);
  res.json({ message: "Task marked as completed" });
});

app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  await db.execute("UPDATE task SET title = ?, description = ? WHERE id = ?", [
    title,
    description,
    id,
  ]);
  res.json({ message: "Task updated successfully" });
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const [result] = await db.execute("DELETE FROM task WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task deleted successfully" });
});

module.exports = { app, initDB };
