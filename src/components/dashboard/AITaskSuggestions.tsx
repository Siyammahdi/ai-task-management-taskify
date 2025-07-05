import { useState, useEffect, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import AILoadingAnimation from "@/components/ui/AILoadingAnimation";

interface SubTask { id: string; title: string; done: boolean; }
interface TaskData {
  title: string;
  description: string;
  subTasks?: SubTask[];
}

function highlightSections(text: string) {
  // Highlight Breakdown, Next Steps, Suggestions
  return text.replace(/(Breakdown:|Next Steps:|Suggestions:)/g, (match) => {
    let color = "text-yellow-500";
    if (match.startsWith("Next")) color = "text-blue-600";
    if (match.startsWith("Suggestions")) color = "text-purple-600";
    return `<span class='block mt-3 mb-1 text-sm font-semibold ${color}'>${match}</span>`;
  });
}

export default function AITaskSuggestions({ task }: { task: TaskData }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string>('');

  // Check if we're in a compact layout (stacked mode)
  const isCompactLayout = typeof window !== "undefined" && window.innerWidth >= 1024 && window.innerWidth <= 1440;

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const res = await fetch("https://ai-task-management-backend.vercel.app/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          subtasks: task.subTasks || [],
        }),
      });
      const data = await res.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setError(data.error || "Failed to get suggestions");
      }
    } catch {
      setError("Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  }, [task.title, task.description, task.subTasks]);

  useEffect(() => {
    const currentTaskId = `${task.title}-${task.description}`;
    if (task.title && task.description && currentTaskId !== lastTaskId) {
      setLastTaskId(currentTaskId);
      setSuggestions(null);
      setError(null);
      handleGenerate();
    }
  }, [task.title, task.description, lastTaskId, handleGenerate]);

  return (
    <div className={`flex flex-col justify-center items-center bg-muted/80 rounded-xl p-4 w-full ${isCompactLayout ? 'min-h-[100px]' : 'min-h-[180px]'}`}>
      {loading ? (
        <AILoadingAnimation />
      ) : suggestions ? (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-primary text-sm">AI Task Suggestions</div>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
              title="Regenerate AI Suggestions"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
          </div>
          <div
            className={`whitespace-pre-line text-xs text-muted-foreground ${isCompactLayout ? 'max-h-[80px] overflow-y-auto' : ''}`}
            dangerouslySetInnerHTML={{ __html: highlightSections(suggestions) }}
          />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-red-500 text-xs mb-2">{error}</div>
            <button onClick={handleGenerate} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-xs shadow hover:bg-primary/90 transition">Try Again</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">AI suggestions are being generated...</div>
            <button onClick={handleGenerate} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-xs shadow hover:bg-primary/90 transition">Generate AI Task Suggestions</button>
          </div>
        </div>
      )}
    </div>
  );
} 