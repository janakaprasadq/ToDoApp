import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaEdit, FaTrash, FaTasks } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editTask, setEditTask] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks`);
    setTasks(res.data);
  };

  const fetchAllTasks = async () => {
    const res = await axios.get(`${API}/tasks/all`);
    setAllTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchAllTasks();
  }, []);

  const addTask = async () => {
    if (!form.title.trim()) return alert("Title is required!");
    if (editTask) {
      await axios.patch(`${API}/tasks/${editTask.id}`, form);
      setEditTask(null);
    } else {
      await axios.post(`${API}/tasks`, form);
    }
    setForm({ title: "", description: "" });
    fetchTasks();
    fetchAllTasks();
  };

  const markDone = async (id) => {
    await axios.patch(`${API}/tasks/${id}/done`);
    fetchTasks();
    fetchAllTasks();
  };

  const deleteTask = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await axios.delete(`${API}/tasks/${id}`);
      fetchTasks();
      fetchAllTasks();
    }
  };

  const startEdit = (task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description });
  };

  const filteredTasks = allTasks.filter((t) => {
    if (filter === "completed") return t.is_completed;
    if (filter === "pending") return !t.is_completed;
    return true;
  });

  const quotes = [
    "Do something today that your future self will thank you for.",
    "Small progress is still progress.",
    "Focus on being productive instead of busy.",
    "Don’t watch the clock; do what it does — keep going.",
    "Your only limit is your mind.",
  ];

  const [randomQuote, setRandomQuote] = useState(quotes[0]);

  useEffect(() => {
    // Rotate quote every 10 seconds
    const interval = setInterval(() => {
      setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 w-full max-w-7xl md:h-[90vh] md:overflow-hidden">
        {/* LEFT PANEL — ADD / EDIT TASK */}
        <div className="flex flex-col justify-between overflow-y-auto pr-2">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-blue-700">
              {editTask ? "✏️ Edit Task" : "➕ Add New Task"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring focus:ring-blue-200"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring focus:ring-blue-200"
              rows="3"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full mb-3"
            >
              {editTask ? "Update Task" : "Add Task"}
            </button>
            {editTask && (
              <button
                onClick={() => {
                  setEditTask(null);
                  setForm({ title: "", description: "" });
                }}
                className="w-full border border-gray-400 rounded-lg py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel Edit
              </button>
            )}
          </div>
          {/* BOTTOM SECTION — STATS + QUOTE */}
          <div className="mt-8 border-t pt-4 text-center text-sm text-gray-600">
            {/* Task Progress Summary */}
            <div className="mb-3">
              <p>
                ✅{" "}
                <span className="font-semibold text-green-600">
                  {allTasks.filter((t) => t.is_completed).length}
                </span>{" "}
                Completed
              </p>
              <p>
                ⏳{" "}
                <span className="font-semibold text-blue-600">
                  {allTasks.filter((t) => !t.is_completed).length}
                </span>{" "}
                Pending
              </p>
            </div>

            {/* Motivational Quote */}
            <div className="italic text-gray-500 bg-gray-50 p-3 rounded-lg shadow-sm">
              “{randomQuote}”
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — RECENT TASKS */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-700">
              🕒 Latest Tasks
            </h2>
            <button
              onClick={() => {
                setShowAll(true);
                fetchAllTasks();
              }}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Show All
            </button>
          </div>
          <div className="overflow-y-auto max-h-[75vh] pr-2">
            {tasks.length === 0 ? (
              <p className="text-gray-500 mt-10 text-center">
                No pending tasks 🎉
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-full ">
                      <h3 className="font-semibold text-lg text-blue-800  px-3 py-2 rounded-md flex items-start gap-2 mb-2">
                        <FaTasks className="text-blue-600 min-w-[20px] h-[20px] flex-shrink-0 mt-1" />
                        {task.title}
                      </h3>
                      <p className="bg-white border border-gray-300 rounded-lg p-2 text-gray-600 break-words whitespace-pre-wrap">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(task.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 ml-2">
                      <button
                        onClick={() => markDone(task.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full transition transform hover:scale-110 shadow-sm"
                        title="Mark as Done"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        onClick={() => startEdit(task)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded-full transition transform hover:scale-110 shadow-sm"
                        title="Edit Task"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full transition transform hover:scale-110 shadow-sm"
                        title="Delete Task"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FULL SCREEN MODAL — ALL TASKS */}
      {showAll && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-5xl p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              📋 All Tasks
            </h2>

            {/* FILTER */}
            <div className="flex justify-end mb-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="max-h-[70vh] overflow-y-auto space-y-3">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`border rounded-lg p-4 ${
                    t.is_completed ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className={`text-blue-800  px-3 py-2 rounded-md flex items-start gap-2 mb-2 ${
                          t.is_completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        <FaTasks className="text-blue-600 min-w-[20px] h-[20px] flex-shrink-0 mt-1" />
                        {t.title}
                      </h3>
                      <p className="bg-white border border-gray-300 rounded-lg p-2 text-gray-600">
                        {t.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(t.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 ml-2">
                      {!t.is_completed && (
                        <button
                          onClick={() => markDone(t.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                          title="Mark as Done"
                        >
                          <FaCheck size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        title="Delete Task"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
