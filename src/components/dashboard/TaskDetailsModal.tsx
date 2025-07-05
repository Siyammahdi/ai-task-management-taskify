import { useState, useEffect } from "react";
import { Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle, ChevronDown, Pencil, X } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import AITaskSuggestions from "./AITaskSuggestions";
import { toast } from 'sonner';
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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
    return dateString;
  }
}

interface BackendSubTask { id: string | number; title: string; done: boolean; }

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate?: (updatedTask: Task) => void;
}

export default function TaskDetailsModal({ task, open, onOpenChange, onTaskUpdate }: TaskDetailsModalProps) {
  const [subTasks, setSubTasks] = useState<SubTask[]>(task?.subTasks || []);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || "");
  const [editDescription, setEditDescription] = useState(task?.description || "");
  const [editDueDate, setEditDueDate] = useState(task?.dueDate.slice(0, 10) || "");
  const [editSubTasks, setEditSubTasks] = useState<SubTask[]>(task?.subTasks || []);

  useEffect(() => {
    if (task) {
      setSubTasks(task.subTasks || []);
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditDueDate(task.dueDate.slice(0, 10));
      setEditSubTasks(task.subTasks || []);
    }
  }, [task]);

  async function toggleSubTaskDone(id: string) {
    if (!task) return;
    
    const updated = subTasks.map((st: SubTask) => st.id === id ? { ...st, done: !st.done } : st);
    setSubTasks(updated);

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
      
      const res = await fetch(`https://ai-task-management-backend.vercel.app/tasks/${task.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const backendSubtasks = data.subtasks || data.subTasks || [];
      
      const backendSubtaskMap = new Map((backendSubtasks as BackendSubTask[]).map((st) => [st.id, st]));
      
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
    if (!task) return;
    
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
      if (onTaskUpdate) {
        onTaskUpdate({
          ...updatedTask,
          id: String(updatedTask.id),
          userId: String(updatedTask.userId),
          subTasks: updatedTask.subtasks || [],
        });
      }
      setIsStatusDropdownOpen(false);
      toast.success('Task status updated!', { id: toastId });
    } catch {
      toast.error('Failed to update task status', { id: toastId });
    }
  }

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
    if (!task) return;
    
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
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditDueDate(task.dueDate.slice(0, 10));
      setEditSubTasks(task.subTasks || []);
    }
    setEditMode(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">
            Task Details
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-1">
            {/* Task Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editMode ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xl font-bold bg-transparent border-b border-border focus:border-primary outline-none pb-2"
                    />
                  ) : (
                    <h1 className="text-xl font-bold">{task.title}</h1>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Due Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="relative">
                    <button
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {getStatusIcon(task.status)}
                      <span>{task.status}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-48">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateTaskStatus(status)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {getStatusIcon(status)}
                            <span>{status}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Due:</span>
                  {editMode ? (
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="bg-transparent border border-border rounded px-2 py-1 focus:border-primary outline-none"
                    />
                  ) : (
                    <span>{formatDate(task.dueDate)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Description</h3>
              {editMode ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full min-h-[100px] p-3 bg-muted/50 border border-border rounded-lg focus:border-primary outline-none resize-none"
                  placeholder="Enter task description..."
                />
              ) : (
                <p className="text-sm leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Subtasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <FaListUl className="w-4 h-4" />
                  Subtasks
                </h3>
                {editMode && (
                  <button
                    onClick={handleAddSubTask}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    + Add Subtask
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {(editMode ? editSubTasks : subTasks).map((subTask, index) => (
                  <div key={subTask.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Checkbox
                      checked={subTask.done}
                      onCheckedChange={() => !editMode && toggleSubTaskDone(subTask.id)}
                      disabled={editMode}
                    />
                    {editMode ? (
                      <input
                        type="text"
                        value={subTask.title}
                        onChange={(e) => handleEditSubTaskChange(index, 'title', e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none"
                        placeholder="Enter subtask title..."
                      />
                    ) : (
                      <span className={`flex-1 text-sm ${subTask.done ? 'line-through text-muted-foreground' : ''}`}>
                        {subTask.title}
                      </span>
                    )}
                    {editMode && (
                      <button
                        onClick={() => handleDeleteSubTask(subTask.id)}
                        className="text-destructive hover:text-destructive/80 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {subTasks.length === 0 && !editMode && (
                  <p className="text-sm text-muted-foreground text-center py-4">No subtasks yet</p>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">AI Suggestions</h3>
              <AITaskSuggestions task={task} />
            </div>

            {/* Edit Mode Actions */}
            {editMode && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 