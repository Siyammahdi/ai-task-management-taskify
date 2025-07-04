import { useState, useEffect } from "react";
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
    return `<span class='block mt-4 mb-1 text-lg font-semibold ${color}'>${match}</span>`;
  });
}

export default function AITaskSuggestions({ task }: { task: TaskData }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastTaskId, setLastTaskId] = useState<string>('');

  // Auto-generate suggestions when task changes
  useEffect(() => {
    const currentTaskId = `${task.title}-${task.description}`;
    if (task.title && task.description && currentTaskId !== lastTaskId) {
      setLastTaskId(currentTaskId);
      setSuggestions(null);
      setError(null);
      handleGenerate();
    }
  }, [task.title, task.description, lastTaskId]);

  async function handleGenerate() {
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
  }

  return (
    <div className="min-h-[220px] flex flex-col justify-center items-center bg-muted/80 rounded-xl  p-6 w-full">
      {loading ? (
        <AILoadingAnimation />
      ) : suggestions ? (
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-primary text-xl">AI Task Suggestions</div>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
              title="Regenerate AI Suggestions"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
          <div
            className="whitespace-pre-line text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: highlightSections(suggestions) }}
          />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-red-500 text-sm mb-3">{error}</div>
            <button onClick={handleGenerate} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold text-base shadow hover:bg-primary/90 transition">Try Again</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-3">AI suggestions are being generated...</div>
            <button onClick={handleGenerate} className="px-6 py-3 rounded-lg bg-primary text-white font-semibold text-base shadow hover:bg-primary/90 transition">Generate AI Task Suggestions</button>
          </div>
        </div>
      )}
    </div>
  );
} 