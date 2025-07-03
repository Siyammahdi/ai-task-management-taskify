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

interface SubTask {
  id: number;
  title: string;
  done: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  userId: string;
  subtasks?: SubTask[];
}

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
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch("http://localhost:4000/tasks", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setTasks(
          Array.isArray(data)
            ? data.map((t: any) => ({
                ...t,
                id: String(t.id),
                userId: String(t.userId),
                subTasks: t.subtasks || [],
              }))
            : []
        );
      } catch (err) {
        setTasks([]);
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Add new task via backend
  const handleAddTask = async (task: any) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;
      const { title, description, status, dueDate, subTasks } = task;
      const res = await fetch("http://localhost:4000/tasks", {
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
        { ...data, id: String(data.id), userId: String(data.userId), subTasks: data.subtasks || [] },
      ]);
      toast.success('Task created!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setSelectedTask(updatedTask);
  };

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    return tasks.filter(
      t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.subtasks && t.subtasks.some((st: any) => st.title.toLowerCase().includes(search.toLowerCase())))
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
                <TaskList tasks={filteredTasks} onSelect={setSelectedTask} selectedTask={selectedTask} singleColumn />
              </ScrollArea>
            </div>
            <div className="w-1/2 h-[calc(100vh-6rem)] min-h-0 flex flex-col">
              <ScrollArea className="h-full min-h-0">
                <TaskDetails task={selectedTask} onTaskUpdate={handleTaskUpdate} />
                <div className="pb-12" />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-6rem)] min-h-0">
            <ScrollArea className="h-full min-h-0">
              <TaskList tasks={filteredTasks} onSelect={setSelectedTask} selectedTask={selectedTask} />
            </ScrollArea>
          </div>
        )}
      </main>
    </div>
  );
} 