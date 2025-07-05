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

  // Check if we're in a compact layout (stacked mode)
  const isCompactLayout = typeof window !== "undefined" && window.innerWidth >= 1024 && window.innerWidth <= 1440;

  return (
    <div className="border border-border rounded-2xl h-full bg-card shadow-sm">
      <ScrollArea className="h-full w-full scrollbar-thin">
        <div className={`p-4 lg:p-6 space-y-4 ${isCompactLayout ? 'lg:space-y-4' : 'lg:space-y-6'}`}>
          {/* Task Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <input 
                    className="text-lg lg:text-xl font-bold flex-1 bg-transparent border-b border-border focus:border-primary outline-none px-2 py-1 w-full" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                  />
                ) : (
                  <h2 className="text-lg lg:text-xl font-bold break-words">{task.title}</h2>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    {getStatusIcon(task.status)}
                    <span className="hidden sm:inline">{task.status}</span>
                    <span className="sm:hidden">{task.status.slice(0, 1)}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateTaskStatus(status)}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
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
                    className="px-2 py-1 rounded-lg bg-primary text-white text-xs font-semibold flex items-center gap-1 shadow hover:bg-primary/90 transition-colors"
                    onClick={() => setEditMode(true)}
                    title="Edit Task"
                  >
                    <Pencil className="w-3 h-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Due Date */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Due:</span>
              {editMode ? (
                <input 
                  type="date" 
                  className="border border-border rounded px-2 py-1 bg-background focus:border-primary outline-none text-xs" 
                  value={editDueDate} 
                  onChange={e => setEditDueDate(e.target.value)} 
                />
              ) : (
                <span className="text-foreground">{formatDate(task.dueDate)}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Description</h3>
            {editMode ? (
              <textarea 
                className="w-full min-h-[80px] p-3 bg-muted/50 border border-border rounded-lg focus:border-primary outline-none resize-none text-xs leading-relaxed" 
                value={editDescription} 
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Enter task description..."
              />
            ) : (
              <p className="text-xs leading-relaxed text-foreground">{task.description}</p>
            )}
          </div>

          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <FaListUl className="w-3 h-3" />
                Subtasks
              </h3>
              {editMode && (
                <button
                  onClick={handleAddSubTask}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  + Add Subtask
                </button>
              )}
            </div>
            
            <div className="space-y-1">
              {(editMode ? editSubTasks : subTasks).map((subTask, index) => (
                <div key={subTask.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <Checkbox
                    checked={subTask.done}
                    onCheckedChange={() => !editMode && toggleSubTaskDone(subTask.id)}
                    disabled={editMode}
                    className="scale-75"
                  />
                  {editMode ? (
                    <input
                      type="text"
                      value={subTask.title}
                      onChange={(e) => handleEditSubTaskChange(index, 'title', e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-xs"
                      placeholder="Enter subtask title..."
                    />
                  ) : (
                    <span className={`flex-1 text-xs ${subTask.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {subTask.title}
                    </span>
                  )}
                  {editMode && (
                    <button
                      onClick={() => handleDeleteSubTask(subTask.id)}
                      className="text-destructive hover:text-destructive/80 p-0.5"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {subTasks.length === 0 && !editMode && (
                <p className="text-xs text-muted-foreground text-center py-3">No subtasks yet</p>
              )}
            </div>
          </div>

          {/* AI Suggestions - Compact version for stacked layout */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">AI Suggestions</h3>
            <div className="min-h-[120px]">
              <AITaskSuggestions task={{ title: task.title, description: task.description, subTasks: subTasks }} />
            </div>
          </div>

          {/* Edit Mode Actions */}
          {editMode && (
            <div className="flex gap-2 pt-3 border-t border-border">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-3 py-1.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-xs"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 