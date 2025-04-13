import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
      <div className="text-5xl font-bold text-center mb-4">{formatTime()}</div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning(true)}
          className="bg-green-600 text-white px-4 py-2 rounded">
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="bg-yellow-600 text-white px-4 py-2 rounded">
          Pause
        </button>
        <button
          onClick={() => setSeconds(1500)}
          className="bg-red-600 text-white px-4 py-2 rounded">
          Reset
        </button>
      </div>
    </div>
  );
}
