import TaskCard from "./TaskCard";
import { useState } from "react";
import type { Task } from "@/types";

export default function TaskList({ 
  tasks, 
  onSelect, 
  selectedTask, 
  singleColumn = false, 
  onDeleteTask
}: { 
  tasks: Task[]; 
  onSelect: (task: Task) => void; 
  selectedTask: Task | null; 
  singleColumn?: boolean; 
  onDeleteTask?: (taskId: string) => void;
}) {
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

  // Check if we're in a compact layout (stacked mode)
  const isCompactLayout = typeof window !== "undefined" && window.innerWidth >= 1024 && window.innerWidth <= 1440;

  // Responsive grid classes
  const getGridClasses = () => {
    if (singleColumn) {
      // For stacked layout, use more compact spacing
      return isCompactLayout 
        ? "flex flex-col gap-2 sm:gap-3" 
        : "flex flex-col gap-3 sm:gap-4 lg:gap-6";
    }
    
    // Mobile: 1 column, Tablet: 2 columns, Desktop: 2-3 columns based on screen size
    return isCompactLayout
      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 min-h-0"
      : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 min-h-0";
  };

  return (
    <div className="h-full overflow-y-auto md:pr-3 scrollbar-thin">
      <div className={`${getGridClasses()} pb-8`}>
        {tasks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 gap-4 select-none animate-fade-in">
            <div className="rounded-full bg-primary/10 p-4 shadow-md mb-2">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary opacity-80 animate-bounce-slow">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xl font-semibold text-primary mb-1">No Tasks Found</div>
            <div className="text-muted-foreground text-base mb-2 text-center max-w-xs">You have no tasks yet. Create your first task to get started and boost your productivity!</div>
            <button
              type="button"
              className="mt-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:bg-primary/90 transition-colors text-base"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              + Add Task
            </button>
          </div>
        ) : (
          tasks.map((task) => {
            const isSelected = selectedTask && selectedTask.id === task.id;
            return (
              <div
                key={task.id}
                onClick={() => onSelect(task)}
                className={
                  "cursor-pointer transition-all rounded-xl bg-card border hover:shadow-md " +
                  (isSelected
                    ? "border-primary shadow-lg"
                    : "border-border hover:border-muted-foreground/40")
                }
              >
                <TaskCard 
                  task={task} 
                  showStatusIcon={!!singleColumn} 
                  isSelected={selectedTask ? selectedTask.id === task.id : undefined} 
                  onDeleteClick={handleDeleteClick}
                  isCompact={isCompactLayout}
                />
              </div>
            );
          })
        )}
      </div>
      
      {/* Global confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full">
            <div className="text-lg font-semibold text-destructive flex items-center gap-2">Delete Task?</div>
            <div className="text-sm text-muted-foreground mb-2 text-center">Are you sure you want to delete this task? This action cannot be undone.</div>
            <div className="flex gap-3 w-full">
              <button 
                className="flex-1 px-4 py-2 rounded-lg bg-destructive text-white font-semibold hover:bg-destructive/90 transition-colors" 
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button 
                className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors" 
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 