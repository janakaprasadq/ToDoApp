# 🧠 Full Stack ToDo App  

### (React.js + Node.js + MySQL + TailwindCSS + Docker)

A modern full stack **To-Do management application** that lets users add, edit, delete, and mark tasks as completed — built for the **Full Stack Engineer Take-Home Assessment**.

---

## 🚀 Tech Stack

| Layer           | Technology / Tools                             |
|-----------------|------------------------------------------------|
| **Frontend**    | React.js (Vite) + TailwindCSS                  |
| **Backend**     | Node.js + Express.js                           |
| **Database**    | MySQL                                          |
| **Testing**     | Vitest + React Testing Library + Jest + Supertest |
| **Containerization** | Docker + Docker Compose                    |
| **Environment** | dotenv                                         |

---

## 🗂️ Project Structure

```
todo-app/
│
├── backend/                 # Express.js + MySQL API
│   ├── server.js
│   ├── tests/
│   │   └── tasks.test.js
│   ├── package.json
│   └── .env
│
├── frontend/                # React + Tailwind UI
│   ├── src/
│   │   ├── App.jsx
│   │   └── __tests__/App.test.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml       # Multi-container setup (API + DB + Frontend)
└── README.md
```

---

## ⚙️ Setup Instructions

### 🧩 1. Clone the Repository

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

---

### 🗄️ 2. Setup the MySQL Database (Manual Option)

Run the following SQL commands:

```sql
CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 🔐 3. Configure Environment Variables

Create `.env` inside the **backend** folder:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=1234
DB_NAME=todo_app
PORT=5000
```

> 💡 For Docker Compose setup, use:
```bash
DB_HOST=mysql
DB_USER=root
DB_PASS=1234
DB_NAME=todoapp
PORT=5000
```

---

## 🧠 Backend Setup (Local)

```bash
cd backend
npm install
npm start
```

Backend runs at 👉 [http://localhost:5000](http://localhost:5000)

---

## 💻 Frontend Setup (Local)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at 👉 [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Setup (Recommended)

### 🧱 1. Build and Run Containers
```bash
docker-compose up --build
```

This will start:
- 🗄️ **MySQL** on port `3306`
- ⚙️ **Backend API** on port `5000`
- 💻 **Frontend (Vite)** on port `5173`

### 🧹 2. Stop Containers
```bash
docker-compose down
```

---

## 🧪 Run Tests

### 🔙 Backend Tests (Jest + Supertest)
```bash
cd backend
npm test
```

Expected:
```
 PASS  tests/tasks.test.js
  🧪 Task API Tests
    √ POST /tasks → create a new task
    √ GET /tasks → fetch recent tasks
    √ PATCH /tasks/:id/done → mark completed
    √ DELETE /tasks/:id → delete a task
```

### 🎨 Frontend Tests (Vitest + RTL)
```bash
cd frontend
npm test
```

Expected:
```
 PASS  src/__tests__/App.test.jsx
  🧪 Todo Frontend Tests
    ✓ renders titles and input fields
    ✓ adds a new todo
    ✓ marks a task as done
```

✅ All tests passing → full app verified

---

## 🗾 API Endpoints

| Method     | Endpoint          | Description                        |
|-------------|------------------|------------------------------------|
| **GET**    | `/tasks`          | Fetch recent (5) uncompleted tasks |
| **GET**    | `/tasks/all`      | Fetch all tasks                    |
| **POST**   | `/tasks`          | Add a new task                     |
| **PATCH**  | `/tasks/:id`      | Update task title/description      |
| **PATCH**  | `/tasks/:id/done` | Mark task as completed             |
| **DELETE** | `/tasks/:id`      | Delete a task                      |

---

## 🎨 Features

✅ Add / Edit / Delete tasks  
✅ Mark tasks as completed  
✅ Task filtering (All / Pending / Completed)  
✅ Show All modal with filter dropdown  
✅ Motivational quote rotation  
✅ Responsive and minimal UI  
✅ Dockerized multi-service architecture  
✅ Tested backend and frontend  

---

## 🧩 Testing Overview

| Layer | Framework | Description |
|-------|------------|--------------|
| **Backend** | Jest + Supertest | Validates REST API endpoints |
| **Frontend** | Vitest + React Testing Library | Validates React UI and axios interactions |
| **Mocking** | vi.mock / jest.mock | Simulates axios network calls |

---

## 🧯 Developer Notes

- Built with **Vite** for ultra-fast frontend builds  
- Uses **Axios** for API communication  
- **mysql2/promise** for async DB queries  
- Clean modular file structure  
- Comprehensive **testing coverage** on both ends  
- **Docker Compose** orchestrates multi-service setup  

---

## 🧑‍💻 Author

**Janaka Prasad**  
Full Stack Engineer Candidate  
📧 [janakaprasad.style@gmail.com](mailto:janakaprasad.style@gmail.com)  
🌐 [LinkedIn](https://www.linkedin.com/in/janaka-prasad/)

---

## 🏁 Summary

This project demonstrates:
- Full CRUD integration between frontend & backend  
- REST API design and testing  
- MySQL schema design and async query handling  
- Responsive and maintainable React architecture  
- Real-world Dockerized deployment workflow  

---
