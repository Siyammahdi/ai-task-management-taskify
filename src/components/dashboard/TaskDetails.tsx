import { useState, useEffect } from "react";
import { Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import AITaskSuggestions from "./AITaskSuggestions";
import { toast } from 'sonner';

type SubTask = { id: string; title: string; done: boolean };
type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  userId: string;
  subTasks?: SubTask[];
};

const STATUS_OPTIONS = [
  "Pending",
  "Logged", 
  "In Progress",
  "On hold",
  "In Review",
  "Completed",
  "Canceled"
];

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

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
}

export default function TaskDetails({ task, onTaskUpdate }: { task: Task; onTaskUpdate?: (updatedTask: Task) => void }) {
  const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks || []);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    setSubTasks(task.subTasks || []);
  }, [task]);

  async function toggleSubTaskDone(id: string) {
    // Optimistically update UI
    const updated = subTasks.map((st: SubTask) => st.id === id ? { ...st, done: !st.done } : st);
    setSubTasks(updated);

    // Send update to backend
    try {
      await fetch(`http://localhost:4000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtasks: updated.map(st => ({ id: st.id, done: st.done })),
        }),
      });
      // Update only the done status from backend while preserving order
      const res = await fetch(`http://localhost:4000/tasks/${task.id}`);
      const data = await res.json();
      const backendSubtasks = data.subtasks || data.subTasks || [];
      
      // Create a map of backend subtask data by ID
      const backendSubtaskMap = new Map(backendSubtasks.map((st: any) => [st.id, st]));
      
      // Update current subtasks with backend data while preserving order
      const updatedWithBackend = updated.map(st => ({
        ...st,
        done: (backendSubtaskMap.get(st.id) as any)?.done ?? st.done
      }));
      
      setSubTasks(updatedWithBackend);
      toast.success('Subtask updated!');
    } catch (err) {
      toast.error('Failed to update subtask');
    }
  }

  async function updateTaskStatus(newStatus: string) {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      // Call the callback to update the parent component
      if (onTaskUpdate) {
        onTaskUpdate({
          ...updatedTask,
          id: String(updatedTask.id),
          userId: String(updatedTask.userId),
          subTasks: updatedTask.subtasks || [],
        });
      }
      // Close dropdown after update
      setIsStatusDropdownOpen(false);
      toast.success('Task status updated!');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  }

  return (
    <div className="border border-border rounded-2xl h-[calc(100vh-9rem)] flex flex-col justify-between bg-card p-8">
      <div className="flex flex-col gap-4 ">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold flex-1">{task.title}</h2>
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-primary/10 text-primary uppercase font-semibold hover:bg-primary/20 transition-colors"
            >
              {getStatusIcon(task.status)}
              {task.status}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {isStatusDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 min-w-[150px]">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateTaskStatus(status)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 ${
                      status === task.status ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {getStatusIcon(status)}
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-b border-border my-2" />
        <div className="text-base text-muted-foreground mb-2">{task.description}</div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="font-medium">Due:</span>
          <span>{formatDate(task.dueDate)}</span>
        </div>
        {subTasks.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2 text-xl font-semibold mb-2"><FaListUl className="w-5 h-5 text-primary" /> Subtasks</div>
            <ul className="flex flex-col gap-2">
              {subTasks.map((sub: SubTask) => (
                <li key={sub.id} className={`flex items-center gap-3 px-4 py-1 rounded-lg transition-colors ${sub.done ? "bg-primary/10 text-muted-foreground" : "bg-background"}`}>
                  <button
                    onClick={() => toggleSubTaskDone(sub.id)}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors ${sub.done ? "bg-primary border-primary text-white" : "border-border bg-background text-muted-foreground hover:border-primary"}`}
                    aria-label={sub.done ? "Mark as not done" : "Mark as done"}
                  >
                    {sub.done ? <CheckCircle className="w-4 h-4" /> : <span className="block w-3 h-3 rounded-full bg-transparent" />}
                  </button>
                  <span className="flex-1 text-sm font-medium">{sub.title}</span>
                  {sub.done && <span className="text-[10px] px-2 rounded bg-primary/10 text-primary font-semibold">Done</span>}
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