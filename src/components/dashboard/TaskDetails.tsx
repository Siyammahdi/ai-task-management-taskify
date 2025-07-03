import { useState, useEffect } from "react";
import { Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle } from "lucide-react";
import { FaRegCircle, FaSpinner, FaCheckCircle, FaListUl } from "react-icons/fa";
import AITaskSuggestions from "./AITaskSuggestions";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  subTasks?: { id: string; title: string; done: boolean }[];
};

function getStatusIcon(status: string) {
  if (status === "Pending") return <Clock className="text-primary w-4 h-4" />;
  if (status === "Logged") return <FileText className="text-blue-500 w-4 h-4" />;
  if (status === "In Progress") return <Loader2 className="text-primary animate-spin w-4 h-4" />;
  if (status === "On hold") return <PauseCircle className="text-yellow-500 w-4 h-4" />;
  if (status === "In Review") return <Eye className="text-purple-500 w-4 h-4" />;
  if (status === "Completed") return <CheckCircle className="text-primary w-4 h-4" />;
  if (status === "Canceled") return <XCircle className="text-destructive w-4 h-4" />;
  return <Clock className="text-primary w-4 h-4" />;
}

export default function TaskDetails({ task }: { task: Task }) {
  const [subTasks, setSubTasks] = useState(task.subTasks || []);

  useEffect(() => {
    setSubTasks(task.subTasks || []);
  }, [task]);

  function toggleSubTaskDone(id: string) {
    setSubTasks(subTasks => subTasks.map(st => st.id === id ? { ...st, done: !st.done } : st));
  }

  return (
    <div className="border border-border rounded-2xl h-[calc(100vh-9rem)] flex flex-col justify-between bg-card p-8">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold flex-1">{task.title}</h2>
          <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-primary/10 text-primary uppercase font-semibold">
            {getStatusIcon(task.status)}
            {task.status}
          </span>
        </div>
        <div className="border-b border-border my-2" />
        <div className="text-xl text-muted-foreground mb-2">{task.description}</div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="font-medium">Due:</span>
          <span>{task.dueDate}</span>
        </div>
        {subTasks.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-xl font-semibold mb-2"><FaListUl className="w-5 h-5 text-primary" /> Subtasks</div>
            <ul className="flex flex-col gap-2">
              {subTasks.map((sub) => (
                <li key={sub.id} className={`flex items-center gap-3 px-4 py-1 rounded-lg border transition-colors ${sub.done ? "bg-primary/10 text-muted-foreground" : "bg-background"}`}>
                  <button
                    onClick={() => toggleSubTaskDone(sub.id)}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors ${sub.done ? "bg-primary border-primary text-white" : "border-border bg-background text-muted-foreground hover:border-primary"}`}
                    aria-label={sub.done ? "Mark as not done" : "Mark as done"}
                  >
                    {sub.done ? <CheckCircle className="w-4 h-4" /> : <span className="block w-3 h-3 rounded-full bg-transparent" />}
                  </button>
                  <span className="flex-1 text-base font-medium">{sub.title}</span>
                  {sub.done && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">Done</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="h-1/3 mb-8">
        <AITaskSuggestions />
      </div>
    </div>
  );
} 