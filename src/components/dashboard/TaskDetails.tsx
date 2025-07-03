import { Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle } from "lucide-react";
import { FaRegCircle, FaSpinner, FaCheckCircle, FaListUl } from "react-icons/fa";

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
  return (
    <div className="border border-border rounded-2xl h-[calc(100vh-9rem)] bg-card p-8 flex flex-col gap-4 pb-12">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl font-bold flex-1">{task.title}</h2>
        <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-md bg-primary/10 text-primary uppercase font-semibold">
          {getStatusIcon(task.status)}
          {task.status}
        </span>
      </div>
      <div className="border-b border-border my-2" />
      <div className="text-base text-muted-foreground mb-2">{task.description}</div>
      <div className="flex items-center gap-2 text-sm mb-2">
        <span className="font-medium">Due:</span>
        <span>{task.dueDate}</span>
      </div>
      {task.subTasks && (
        <div className="mt-2">
          <div className="flex items-center gap-2 font-semibold mb-2"><FaListUl className="w-4 h-4 text-primary" /> Subtasks</div>
          <ul className="list-disc list-inside space-y-1">
            {task.subTasks.map((sub) => (
              <li key={sub.id} className={sub.done ? "line-through text-muted-foreground" : ""}>
                {sub.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 