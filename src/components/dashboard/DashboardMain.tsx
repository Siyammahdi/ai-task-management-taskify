"use client";

import { useState, useMemo, useEffect } from "react";
import Menubar from "../Menubar";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskSearchBar from "./TaskSearchBar";
import TaskDialog from "./TaskDialog";
import { jwtDecode } from "jwt-decode";
import { toast } from 'sonner';
import type { Task } from "@/types";

interface SubTask { id: string | number; title: string; done: boolean; }

export default function DashboardMain() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
      const decoded = jwtDecode<{ userId: string }>(token);
      const userId = decoded.userId;
      const { title, description, status, dueDate, subTasks } = task;
      const res = await fetch("https://ai-task-management-backend.vercel.app/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status, dueDate, userId, subtasks: subTasks }),
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
      await fetch(`https://ai-task-management-backend.vercel.app/tasks/${Number(taskId)}`, {
        method: 'DELETE',
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
      <div className="h-screen sticky top-0 left-0 z-10 w-64 flex-shrink-0">
        <Menubar />
      </div>
      <main className="flex-1 p-8 w-full h-screen overflow-hidden pb-8">
        <div className="py-6 flex flex-col gap-6">
          <TaskSearchBar search={search} setSearch={setSearch} onAddTask={() => setOpen(true)} />
        </div>
        <TaskDialog open={open} setOpen={setOpen} setTasks={handleAddTask} />
        {loading ? (
          <div className="flex items-center justify-center h-full text-lg text-muted-foreground">Loading tasks...</div>
        ) : selectedTask ? (
          <div className="hidden md:flex gap-8 w-full h-[calc(100vh-6rem)] min-h-0">
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <ScrollArea className="flex-1 h-full min-h-0">
                <TaskList tasks={filteredTasks.map(t => ({ ...t, userId: String(t.userId || '') }))} onSelect={setSelectedTask} selectedTask={selectedTask} singleColumn onDeleteTask={handleDeleteTask} />
              </ScrollArea>
            </div>
            <div className="w-1/2 h-[calc(100vh-6rem)] min-h-0 flex flex-col">
              <ScrollArea className="h-full min-h-0">
                <TaskDetails task={{ ...selectedTask, userId: String(selectedTask.userId || '') }} onTaskUpdate={handleTaskUpdate} />
                <div className="pb-12" />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-6rem)] min-h-0">
            <ScrollArea className="h-full min-h-0">
              <TaskList tasks={filteredTasks.map(t => ({ ...t, userId: String(t.userId || '') }))} onSelect={setSelectedTask} selectedTask={selectedTask} onDeleteTask={handleDeleteTask} />
            </ScrollArea>
          </div>
        )}
      </main>
    </div>
  );
} 