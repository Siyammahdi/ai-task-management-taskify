import { useState, useEffect } from "react";
import { Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle, ChevronDown, Pencil } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import AITaskSuggestions from "./AITaskSuggestions";
import { toast } from 'sonner';
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

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
  } catch {
    return dateString; // Return original string if parsing fails
  }
}

// Define types for SubTask
interface BackendSubTask { id: string | number; title: string; done: boolean; }

export default function TaskDetails({ task, onTaskUpdate }: { task: Task; onTaskUpdate?: (updatedTask: Task) => void }) {
  const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks || []);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDueDate, setEditDueDate] = useState(task.dueDate.slice(0, 10));
  const [editSubTasks, setEditSubTasks] = useState<SubTask[]>(task.subTasks || []);

  useEffect(() => {
    setSubTasks(task.subTasks || []);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate.slice(0, 10));
    setEditSubTasks(task.subTasks || []);
  }, [task]);

  async function toggleSubTaskDone(id: string) {
    // Optimistically update UI
    const updated = subTasks.map((st: SubTask) => st.id === id ? { ...st, done: !st.done } : st);
    setSubTasks(updated);

    // Send update to backend
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading('Updating subtask...');
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await fetch(`https://ai-task-management-backend.vercel.app/tasks/${task.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          subtasks: updated.map(st => ({ id: st.id, done: st.done })),
        }),
      });
      // Update only the done status from backend while preserving order
      const res = await fetch(`https://ai-task-management-backend.vercel.app/tasks/${task.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const backendSubtasks = data.subtasks || data.subTasks || [];
      
      // Create a map of backend subtask data by ID
      const backendSubtaskMap = new Map((backendSubtasks as BackendSubTask[]).map((st) => [st.id, st]));
      
      // Update current subtasks with backend data while preserving order
      const updatedWithBackend = updated.map(st => ({
        ...st,
        done: (() => {
          const backendSub = backendSubtaskMap.get(st.id);
          return backendSub && typeof backendSub === 'object' && 'done' in backendSub
            ? (backendSub as BackendSubTask).done
            : st.done;
        })()
      }));
      
      setSubTasks(updatedWithBackend);
      toast.success('Subtask updated!', { id: toastId });
    } catch {
      toast.error('Failed to update subtask', { id: toastId });
    }
  }

  async function updateTaskStatus(newStatus: string) {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading('Updating status...');
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`https://ai-task-management-backend.vercel.app/tasks/${task.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
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
      toast.success('Task status updated!', { id: toastId });
    } catch {
      toast.error('Failed to update task status', { id: toastId });
    }
  }

  // Edit mode handlers
  const handleEditSubTaskChange = (idx: number, field: 'title' | 'done', value: string | boolean) => {
    setEditSubTasks(prev => prev.map((st, i) => i === idx ? { ...st, [field]: value } : st));
  };
  const handleAddSubTask = () => {
    setEditSubTasks(prev => [
      ...prev,
      { id: `temp-${Date.now()}-${Math.random()}`, title: '', done: false }
    ]);
  };
  const handleDeleteSubTask = (id: string) => {
    setEditSubTasks(prev => prev.filter(st => st.id !== id));
  };
  const handleSaveEdit = async () => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading('Saving changes...');
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`https://ai-task-management-backend.vercel.app/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          dueDate: editDueDate,
          subtasks: editSubTasks.map(st => ({
            id: st.id && !String(st.id).startsWith('temp-') ? st.id : undefined,
            title: st.title,
            done: st.done
          })),
        }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      if (onTaskUpdate) {
        onTaskUpdate({
          ...updatedTask,
          id: String(updatedTask.id),
          userId: String(updatedTask.userId),
          subTasks: updatedTask.subtasks || [],
        });
      }
      setEditMode(false);
      toast.success('Task updated!', { id: toastId });
    } catch {
      toast.error('Failed to update task', { id: toastId });
    }
  };
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate.slice(0, 10));
    setEditSubTasks(task.subTasks || []);
  };

  return (
    <div className="border border-border rounded-2xl h-[calc(100vh-9rem)] bg-white p-8 flex flex-col">
      <ScrollArea className="flex-1 w-full pr-4 min-h-0">
        <div className="flex flex-col gap-4 pb-8">
          <div className="flex items-center gap-3">
            {editMode ? (
              <input className="text-3xl font-bold flex-1 bg-background border-b border-border focus:outline-none px-2 py-1" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            ) : (
              <h2 className="text-2xl font-bold flex-1">{task.title}</h2>
            )}
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
            {!editMode && (
              <button
                className="ml-2 px-3 py-1 rounded-md bg-primary text-white text-xs font-semibold flex items-center gap-2 shadow hover:bg-primary/90 transition-colors border border-primary"
                onClick={() => setEditMode(true)}
                title="Edit Task"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <div className="border-b border-border my-2" />
          <div className="space-y-8">
            {editMode ? (
              <textarea className="text-base text-muted-foreground mb-4 bg-background border border-border rounded p-2 w-full" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
            ) : (
              <div className="text-base text-muted-foreground mb-4">{task.description}</div>
            )}
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className="font-medium">Due:</span>
              {editMode ? (
                <input type="date" className="border border-border rounded px-2 py-1 bg-background" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
              ) : (
                <span>{formatDate(task.dueDate)}</span>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xl text-primary font-bold mb-2"><FaListUl className="w-5 h-5 text-primary" /> Subtasks</div>
              <ul className="flex flex-col gap-2">
                {editMode ? (
                  editSubTasks.map((sub) => (
                    <li key={sub.id} className="flex items-center gap-3 px-4 py-1 rounded-lg bg-background">
                      <input className="flex-1 text-sm font-medium border-b border-border bg-background focus:outline-none" value={sub.title} onChange={e => handleEditSubTaskChange(editSubTasks.findIndex(st => st.id === sub.id), 'title', e.target.value)} placeholder="Subtask title" />
                      <Checkbox checked={sub.done} onCheckedChange={checked => handleEditSubTaskChange(editSubTasks.findIndex(st => st.id === sub.id), 'done', !!checked)} />
                      <button className="text-destructive text-xs ml-2" onClick={() => handleDeleteSubTask(sub.id)}>Delete</button>
                    </li>
                  ))
                ) : (
                  subTasks.length > 0 && subTasks.map((sub: SubTask) => (
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
                  ))
                )}
              </ul>
              {editMode && (
                <button className="mt-2 px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/90" onClick={handleAddSubTask}>Add Subtask</button>
              )}
            </div>
          </div>
          {editMode && (
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-1 rounded bg-primary text-white font-semibold hover:bg-primary/90" onClick={handleSaveEdit}>Save</button>
              <button className="px-4 py-1 rounded bg-muted text-foreground font-semibold hover:bg-muted/80" onClick={handleCancelEdit}>Cancel</button>
            </div>
          )}
          <div className="mt-8">
            <AITaskSuggestions task={{ title: task.title, description: task.description, subTasks: subTasks }} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 