import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <Header />
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <TaskList />
          <Timer />
        </div>
      </div>
    </div>
  );
}
