import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function TaskSearchBar({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="relative w-full min-w-0 max-w-2xl">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 sm:pl-10 w-full h-10 sm:h-12 text-sm sm:text-base rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm"
        />
      </div>
    </div>
  );
} 