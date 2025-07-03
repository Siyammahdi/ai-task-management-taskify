import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onSelect, selectedTask, singleColumn = false }: { tasks: any[]; onSelect: (task: any) => void; selectedTask: any; singleColumn?: boolean }) {
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
                <TaskCard task={task} showStatusIcon={!!singleColumn} isSelected={isSelected} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 