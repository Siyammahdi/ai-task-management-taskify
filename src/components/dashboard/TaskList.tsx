import TaskCard from "./TaskCard";
import { useState } from "react";
import type { Task } from "@/types";

export default function TaskList({ tasks, onSelect, selectedTask, singleColumn = false, onDeleteTask }: { tasks: Task[]; onSelect: (task: Task) => void; selectedTask: Task | null; singleColumn?: boolean; onDeleteTask?: (taskId: string) => void }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setDeleteId(taskId);
  };

  const handleConfirmDelete = () => {
    if (onDeleteTask && deleteId) onDeleteTask(deleteId);
    setDeleteId(null);
  };

  const handleCancelDelete = () => setDeleteId(null);

  return (
    <div className="h-full overflow-y-auto pr-3">
      <div className={(singleColumn ? "flex flex-col gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0") + " pb-12"}>
        {tasks.length === 0 ? (
          <div className="col-span-2 flex items-center justify-center text-muted-foreground text-lg h-40">
            No tasks found.
          </div>
        ) : (
          tasks.map((task) => {
            const isSelected = selectedTask && selectedTask.id === task.id;
            return (
              <div
                key={task.id}
                onClick={() => onSelect(task)}
                className={
                  "cursor-pointer transition-all rounded-xl bg-card border " +
                  (isSelected
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground/40")
                }
              >
                <TaskCard task={task} showStatusIcon={!!singleColumn} isSelected={selectedTask ? selectedTask.id === task.id : undefined} onDeleteClick={handleDeleteClick} />
              </div>
            );
          })
        )}
      </div>
      {/* Global confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="text-lg font-semibold text-destructive flex items-center gap-2">Delete Task?</div>
            <div className="text-sm text-muted-foreground mb-2">Are you sure you want to delete this task? This action cannot be undone.</div>
            <div className="flex gap-3">
              <button className="px-4 py-1 rounded bg-destructive text-white font-semibold hover:bg-destructive/90" onClick={handleConfirmDelete}>Delete</button>
              <button className="px-4 py-1 rounded bg-muted text-foreground font-semibold hover:bg-muted/80" onClick={handleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 