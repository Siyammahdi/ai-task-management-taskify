"use client";

import { useState, useMemo } from "react";
import Menubar from "../Menubar";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetails";
import tasksData from "../../data/mockTasks";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskSearchBar from "./TaskSearchBar";
import TaskDialog from "./TaskDialog";


export default function DashboardMain() {
  const [tasks, setTasks] = useState(tasksData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    return tasks.filter(
      t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.subTasks && t.subTasks.some(st => st.title.toLowerCase().includes(search.toLowerCase())))
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
        <TaskDialog open={open} setOpen={setOpen} setTasks={setTasks} />
        {selectedTask ? (
          <div className="hidden md:flex gap-8 w-full h-[calc(100vh-6rem)] min-h-0">
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <ScrollArea className="flex-1 h-full min-h-0">
                <TaskList tasks={filteredTasks} onSelect={setSelectedTask} selectedTask={selectedTask} singleColumn />
              </ScrollArea>
            </div>
            <div className="w-1/2 h-[calc(100vh-6rem)] min-h-0 flex flex-col">
              <ScrollArea className="h-full min-h-0">
                <TaskDetails task={selectedTask} />
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