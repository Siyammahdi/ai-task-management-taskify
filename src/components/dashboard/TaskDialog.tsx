import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { PlusIcon, Clock, FileText, Loader2, PauseCircle, Eye, CheckCircle, XCircle } from "lucide-react";
import type { Task } from "@/types";

const STATUS_OPTIONS = [
  { value: "Logged", label: "Logged", icon: <FileText className="text-blue-500 w-4 h-4" />, tooltip: "Task has been logged for tracking or auditing purposes." },
  { value: "Pending", label: "Pending", icon: <Clock className="text-primary w-4 h-4" />, tooltip: "Task is created but not started yet." },
  { value: "In Progress", label: "In Progress", icon: <Loader2 className="text-primary animate-spin w-4 h-4" />, tooltip: "Task is currently being worked on." },
  { value: "On hold", label: "On hold", icon: <PauseCircle className="text-yellow-500 w-4 h-4" />, tooltip: "Task is paused and will be resumed later." },
  { value: "In Review", label: "In Review", icon: <Eye className="text-purple-500 w-4 h-4" />, tooltip: "Task is under review or awaiting approval." },
  { value: "Completed", label: "Completed", icon: <CheckCircle className="text-primary w-4 h-4" />, tooltip: "Task is finished and completed." },
  { value: "Canceled", label: "Canceled", icon: <XCircle className="text-destructive w-4 h-4" />, tooltip: "Task has been canceled and will not be completed." },
];

export default function TaskDialog({ open, setOpen, setTasks }: { open: boolean; setOpen: (v: boolean) => void; setTasks: (task: Omit<Task, 'id' | 'userId'>) => void }) {
  const [form, setForm] = useState<{ title: string; description: string; status: string; dueDate: Date | undefined }>({ title: "", description: "", status: "Pending", dueDate: undefined });
  const [subTaskInput, setSubTaskInput] = useState("");
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  function handleAddTask() {
    setTasks({
      title: form.title,
      description: form.description,
      status: form.status,
      dueDate: form.dueDate ? form.dueDate.toISOString() : "",
      subTasks: subTasks.length > 0 ? subTasks.map((t, idx) => ({ id: `temp-${Date.now()}-${idx}`, title: t, done: false })) : undefined,
    });
    setForm({ title: "", description: "", status: "Pending", dueDate: undefined });
    setSubTasks([]);
    setSubTaskInput("");
    setOpen(false);
  }

  function handleAddSubTask() {
    if (subTaskInput.trim() && subTaskInput.length <= 50) {
      setSubTasks([...subTasks, subTaskInput.trim()]);
      setSubTaskInput("");
    }
  }

  function handleRemoveSubTask(idx: number) {
    setSubTasks(subTasks.filter((_, idx2) => idx2 !== idx));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-4xl w-full min-h-[500px] p-10 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-2">Add New Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAddTask();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4"
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="title" className="font-medium text-sm">Title</label>
            <Input id="title" className="text-lg h-12" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-medium text-sm">Status</label>
            <Select value={form.status} onValueChange={value => setForm(f => ({ ...f, status: value }))}>
              <SelectTrigger className="h-12 min-h-[48px] text-base w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary">
                <SelectValue placeholder="Pending" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <Tooltip key={option.value}>
                    <TooltipTrigger asChild>
                      <SelectItem value={option.value}>
                        <span className="flex items-center gap-2">{option.icon} {option.label}</span>
                      </SelectItem>
                    </TooltipTrigger>
                    <TooltipContent>{option.tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="dueDate" className="font-medium text-sm">Due Date</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={"justify-start text-left font-normal h-12 " + (form.dueDate ? "" : "text-muted-foreground")}
                >
                  {form.dueDate ? format(form.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.dueDate}
                  onSelect={date => setForm(f => ({ ...f, dueDate: date ?? undefined }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="description" className="font-medium text-sm">Description</label>
            <Textarea id="description" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={10} className="text-base min-h-[180px]" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-medium text-sm">Subtasks</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask (max 50 characters)"
                value={subTaskInput}
                onChange={e => {
                  const value = e.target.value;
                  if (value.length <= 50) setSubTaskInput(value);
                }}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSubTask(); } }}
                className="h-12 min-h-[48px]"
              />
              <Button type="button" variant="outline" onClick={handleAddSubTask} className="px-3 w-12 h-12 min-h-[48px] flex items-center justify-center"><PlusIcon /></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {subTasks.map((sub, idx) => (
                <span key={idx} className="bg-muted-foreground/5 text-sm px-3 py-1 rounded-lg flex items-center gap-2">
                  {sub}
                  <button type="button" className="ml-1 text-destructive hover:underline" onClick={() => handleRemoveSubTask(idx)}>&times;</button>
                </span>
              ))}
            </div>
          </div>
          <DialogFooter className="md:col-span-2 flex flex-row items-center justify-between gap-4 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 