import { useState, useEffect } from "react";
import useVoiceRecognition from "../hooks/useVoiceRecognition";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState(""); // Input for manual task entry
  const [priority, setPriority] = useState("Medium");
  const [editMode, setEditMode] = useState(null); // Track the task currently being edited
  const [editedTitle, setEditedTitle] = useState(""); // Track the edited title

  const { transcript, listening, startListening } = useVoiceRecognition();

  // Fetch tasks when component mounts
  useEffect(() => {
    fetch("https://todolist-backend-8zps.onrender.com/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Update tasks when the transcript changes
  useEffect(() => {
    if (transcript) {
      const newTask = {
        title: transcript,
        completed: false,
        priority: priority,
      };

      // Post the new task to the backend
      fetch("https://todolist-backend-8zps.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((data) => setTasks((prevTasks) => [...prevTasks, data]))
        .catch((error) => console.error("Error adding task:", error));
    }
  }, [transcript, priority]);

  // Add task manually (via the input field)
  const handleAddTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      title: input,
      completed: false,
      priority: priority,
    };

    // Post the new task to the backend
    fetch("https://todolist-backend-8zps.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => setTasks((prevTasks) => [...prevTasks, data]))
      .catch((error) => console.error("Error adding task:", error));

    setInput(""); // Clear input after adding task
  };

  // Update task
  const handleUpdateTask = (id, completedStatus = null) => {
    const updatedTask = {
      title: editedTitle || tasks.find((task) => task._id === id).title,
      priority: priority,
      completed: completedStatus !== null ? completedStatus : null,
    };

    fetch(`https://todolist-backend-8zps.onrender.com/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(tasks.map((task) => (task._id === id ? data : task)));
        setEditMode(null); // Exit edit mode after updating
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete task
  const handleDeleteTask = (id) => {
    fetch(`https://todolist-backend-8zps.onrender.com/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id)); // Remove task from UI
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>

      {/* Task Input (Manual typing and voice input) */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update input field with manual input
          placeholder="Add a task..."
          className="w-full px-4 py-2 border rounded-lg"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)} // Don't trigger update directly on priority change
          className="px-4 py-2 border rounded-lg">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={handleAddTask} // Add task manually
          className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add
        </button>
        <button
          onClick={startListening} // Start voice recognition
          className={`px-4 py-2 rounded-lg ${
            listening ? "bg-red-600" : "bg-gray-600"
          } text-white`}>
          🎙️
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleUpdateTask(task._id, !task.completed)} // Toggle the completion status
              />
              <span
                className={task.completed ? "line-through text-gray-400" : ""}>
                {editMode === task._id ? (
                  <input
                    type="text"
                    value={editedTitle || task.title}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  task.title
                )}
              </span>

              {/* Priority Label */}
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.priority === "High"
                    ? "bg-red-500 text-white"
                    : task.priority === "Medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}>
                {task.priority}
              </span>
            </div>

            <div className="flex gap-2">
              {editMode === task._id ? (
                <button
                  className="text-sm text-blue-600"
                  onClick={() => handleUpdateTask(task._id)} // Save changes
                >
                  Save
                </button>
              ) : (
                <button
                  className="text-sm text-blue-600"
                  onClick={() => setEditMode(task._id)} // Edit task
                >
                  Edit
                </button>
              )}

              <button
                className="text-sm text-red-600"
                onClick={() => handleDeleteTask(task._id)} // Delete task
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
