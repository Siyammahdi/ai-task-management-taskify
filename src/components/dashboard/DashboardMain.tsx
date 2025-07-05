"use client";

import { useState, useMemo, useEffect } from "react";
import Menubar from "../Menubar";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskSearchBar from "./TaskSearchBar";
import TaskDialog from "./TaskDialog";
import { toast } from 'sonner';
import { Menu, X, Plus, ListTodoIcon } from "lucide-react";
import type { Task } from "@/types";

interface SubTask { id: string | number; title: string; done: boolean; }

export default function DashboardMain() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      let toastId: string | number | undefined;
      try {
        toastId = toast.loading('Loading tasks...');
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch("https://ai-task-management-backend.vercel.app/tasks", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setTasks(
          Array.isArray(data)
            ? data.map((t) => {
              const task = t as Task;
              return {
                ...task,
                id: String(task.id),
                userId: String(task.userId || ''),
                subTasks: (task.subTasks || task.subtasks || []),
              };
            })
            : []
        );
        toast.success('Tasks loaded!', { id: toastId });
      } catch {
        setTasks([]);
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Add new task via backend
  const handleAddTask = async (task: Omit<Task, 'id' | 'userId'>) => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading('Creating task...');
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      const { title, description, status, dueDate, subTasks } = task;
      const res = await fetch("https://ai-task-management-backend.vercel.app/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status, dueDate, subtasks: subTasks }),
      });
      const data = await res.json();
      setTasks((prev) => [
        ...prev,
        { ...data, id: String(data.id), userId: String(data.userId), subTasks: data.subTasks || data.subtasks || [] },
      ]);
      toast.success('Task created!', { id: toastId });
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = async (taskId: string) => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading('Deleting task...');
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await fetch(`https://ai-task-management-backend.vercel.app/tasks/${Number(taskId)}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setSelectedTask((prev) => (prev && prev.id === taskId ? null : prev));
      toast.success('Task deleted!', { id: toastId });
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    return tasks.filter(
      t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.subTasks && t.subTasks.some((st: SubTask) => st.title.toLowerCase().includes(search.toLowerCase())))
    );
  }, [tasks, search]);

  return (
    <div className="min-h-screen h-screen flex bg-background text-foreground w-full overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="text-xl lg:text-2xl font-bold lg:mb-10 tracking-tight text-primary flex items-center gap-2 select-none">
                <ListTodoIcon className="w-6 h-6 lg:w-7 lg:h-7" />
                <span className="">Taskify</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Menubar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 left-0 z-10 w-64 flex-shrink-0">
        <Menubar />
      </div>

      <main className="flex-1 w-full h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-lg font-bold text-primary">Taskify</div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 lg:p-8 w-full h-full overflow-hidden">
          <div className="py-2 lg:py-6 flex flex-col gap-4 lg:gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TaskSearchBar search={search} setSearch={setSearch} />
              {/* Desktop Add Task Button */}
              <button
                onClick={() => setOpen(true)}
                className="hidden lg:flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>
          <TaskDialog open={open} setOpen={setOpen} setTasks={handleAddTask} />

          {loading ? (
            <div className="flex items-center justify-center h-full text-lg text-muted-foreground">Loading tasks...</div>
          ) : selectedTask ? (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] min-h-0">
              {/* Task List - Full width on mobile, half on desktop */}
              <div className="flex-1 flex flex-col min-w-0 h-full">
                <ScrollArea className="flex-1 h-full min-h-0">
                  <TaskList
                    tasks={filteredTasks.map(t => ({ ...t, userId: String(t.userId || '') }))}
                    onSelect={setSelectedTask}
                    selectedTask={selectedTask}
                    singleColumn
                    onDeleteTask={handleDeleteTask}
                  />
                </ScrollArea>
              </div>

              {/* Task Details - Full width on mobile, half on desktop */}
              <div className="flex-1 lg:w-1/2 h-full min-h-0 flex flex-col">
                <ScrollArea className="h-full min-h-0">
                  <TaskDetails
                    task={{ ...selectedTask, userId: String(selectedTask.userId || '') }}
                    onTaskUpdate={handleTaskUpdate}
                  />
                  <div className="pb-12" />
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] min-h-0">
              <ScrollArea className="h-full min-h-0">
                <TaskList
                  tasks={filteredTasks.map(t => ({ ...t, userId: String(t.userId || '') }))}
                  onSelect={setSelectedTask}
                  selectedTask={selectedTask}
                  onDeleteTask={handleDeleteTask}
                />
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Fixed Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            aria-label="Add Task"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  );
} 