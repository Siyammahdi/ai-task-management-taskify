import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AITaskSuggestions() {
  const [loading, setLoading] = useState(false);

  function handleGenerate() {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div className="mt-8 p-4 h-full  rounded-xl bg-muted">
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">AI is generating suggestions...</span>
        </div>
      ) : (
        <Button onClick={handleGenerate} className="px-4 py-2">Generate AI Task Suggestions</Button>
      )}
    </div>
  );
} 