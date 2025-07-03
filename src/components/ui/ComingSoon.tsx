"use client";

import { ReactNode } from "react";
import { InfoIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        {icon ? (
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
            {icon}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
            <InfoIcon className="w-10 h-10" />
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-2 tracking-tight text-primary">{title}</h1>
      <p className="text-muted-foreground text-lg max-w-xl mb-6">{description}</p>
      <span className="inline-block bg-gradient-to-r from-primary to-emerald-500 px-6 py-3 rounded-full text-base text-white font-bold shadow-lg animate-pulse mb-6">
        Coming Soon
      </span>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors border border-border shadow"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>
    </div>
  );
} 