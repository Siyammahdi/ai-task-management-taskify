import { Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

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

export default function TaskCard({ 
  task, 
  showStatusIcon, 
  isSelected, 
  onDeleteClick,
  isCompact = false
}: { 
  task: Task; 
  showStatusIcon?: boolean; 
  isSelected?: boolean; 
  onDeleteClick?: (e: React.MouseEvent, taskId: string) => void;
  isCompact?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${isCompact ? 'p-2 sm:p-3' : 'p-3 sm:p-4 lg:p-5'} bg-card rounded-xl relative transition-smooth  ${isSelected ? "bg-primary/10" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        {showStatusIcon && getStatusIcon(task.status)}
        <h2 className={`font-semibold ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base lg:text-lg'} truncate max-w-[70%] ${isSelected ? "text-primary" : ""}`}>
          {task.title}
        </h2>
        <span className="ml-auto flex items-center gap-1 text-[8px] sm:text-[9px] lg:text-xs px-2 py-1 rounded-md bg-primary/10 text-primary uppercase font-semibold">
          {getStatusIcon(task.status)}
          <span className="hidden sm:inline">{task.status}</span>
          <span className="sm:hidden">{task.status.slice(0, 1)}</span>
        </span>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {task.description}
      </p>
      <div className="flex items-center justify-between text-[9px] sm:text-[10px] lg:text-xs mt-2">
        <span className="text-muted-foreground">Due: {formatDate(task.dueDate)}</span>
        <div className="flex items-center gap-2">
          {task.subTasks && (
            <span className="hidden sm:inline">{task.subTasks.length} Subtasks</span>
          )}
          {onDeleteClick && (
            <button
              className="p-1.5 sm:p-1 rounded-full text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors"
              onClick={e => onDeleteClick(e, task.id)}
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 