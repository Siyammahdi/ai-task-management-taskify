"use client";

import Menubar from "../../components/Menubar";
import { Card } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const SPECIAL_HOLIDAYS = [
  { name: "Eid ul Adha", date: "2024-06-17" },
  { name: "Eid ul Fitr", date: "2024-04-10" },
];

export default function CalendarPage() {
  const [note, setNote] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="text-xl font-bold text-primary">Taskify</div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Menubar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Menubar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-lg font-bold text-primary">Calendar</div>
            <div className="w-10" />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto h-full">
              {/* Mobile Layout - Stacked */}
              <div className="lg:hidden flex flex-col gap-4 h-full">
                {/* Calendar Card */}
                <Card className="flex-1 p-4">
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <Calendar className="w-full h-full" />
                    </div>
                    <div className="mt-4">
                      <div className="rounded-lg bg-muted/60 p-3">
                        <span className="text-xs font-semibold text-muted-foreground mb-2 block tracking-wide uppercase">
                          Public Holidays
                        </span>
                        <div className="space-y-1">
                          {SPECIAL_HOLIDAYS.map(holiday => (
                            <div key={holiday.name} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 text-primary text-sm">
                              <span className="flex-1 truncate">{holiday.name}</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">{holiday.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Notes Card */}
                <Card className="p-4 h-48">
                  <h2 className="text-lg font-semibold mb-2 text-primary">Temporary Note</h2>
                  <Textarea
                    className="resize-none w-full h-full border-none bg-muted/90 rounded-lg text-sm"
                    placeholder="Write a quick note..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </Card>
              </div>

              {/* Desktop Layout - Side by Side */}
              <div className="hidden lg:flex gap-6 h-full">
                {/* Calendar Card */}
                <Card className="flex-1 p-6">
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <Calendar className="w-full h-full" />
                    </div>
                    <div className="mt-6">
                      <div className="rounded-lg bg-muted/60 p-4">
                        <span className="text-sm font-semibold text-muted-foreground mb-3 block tracking-wide uppercase">
                          Public Holidays
                        </span>
                        <div className="space-y-2">
                          {SPECIAL_HOLIDAYS.map(holiday => (
                            <div key={holiday.name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary text-base">
                              <span className="flex-1">{holiday.name}</span>
                              <span className="text-sm text-muted-foreground">{holiday.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Notes Card */}
                <Card className="w-80 p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Temporary Note</h2>
                  <Textarea
                    className="resize-none w-full h-full border-none bg-muted/90 rounded-lg text-base"
                    placeholder="Write a quick note..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 