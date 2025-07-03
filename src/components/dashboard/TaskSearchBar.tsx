import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskSearchBar({ search, setSearch, onAddTask }: { search: string; setSearch: (v: string) => void; onAddTask: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="relative w-full min-w-sm max-w-xl">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon className="w-5 h-5" />
        </span>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 w-full h-12 text-base rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm"
        />
      </div>
      <Button onClick={onAddTask} className="gap-2 px-6 py-3 text-base font-semibold mt-4 md:mt-0 mx-3"><PlusIcon className="w-5 h-5" /> Add Task</Button>
    </div>
  );
} 