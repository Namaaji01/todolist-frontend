import { useState, useEffect } from "react";
import useVoiceRecognition from "../hooks/useVoiceRecognition";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const { transcript, listening, startListening } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript); // Update input box with voice text
      handleAddTask(transcript); // Optionally auto-add
    }
  }, [transcript]);

  const handleAddTask = (text = input) => {
    if (text.trim() === "") return;

    const newTask = {
      title: text,
      completed: false,
      priority: "Medium",
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>

      {/* Task Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          onClick={() => handleAddTask()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add
        </button>
        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-lg ${
            listening ? "bg-red-600" : "bg-gray-600"
          } text-white`}>
          🎙️
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>{task.title}</span>
            <button className="text-sm text-green-600">Complete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
