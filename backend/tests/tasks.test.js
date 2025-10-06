const request = require("supertest");
const mysql = require("mysql2/promise");
const { app, initDB } = require("../app");

let db;
let createdTaskId;

beforeAll(async () => {
  await initDB();
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
});

afterAll(async () => {
  await db.end();
});

describe("🧪 Task API Tests", () => {
  test("POST /tasks → create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test Task", description: "This is a test" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task created successfully");

    const [rows] = await db.execute("SELECT * FROM task WHERE title = ?", [
      "Test Task",
    ]);
    expect(rows.length).toBeGreaterThan(0);
    createdTaskId = rows[0].id;
  });

  test("GET /tasks → fetch recent tasks", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("PATCH /tasks/:id/done → mark task completed", async () => {
    const res = await request(app).patch(`/tasks/${createdTaskId}/done`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task marked as completed");
  });

  test("DELETE /tasks/:id → delete a task", async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });
});
