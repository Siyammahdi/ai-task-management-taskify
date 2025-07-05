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
          <div className="flex-1 overflow-auto p-4 lg:p-6 xl:p-8">
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

              {/* Desktop Layout - Side by Side with better responsive design */}
              <div className="hidden lg:flex gap-4 xl:gap-6 h-full">
                {/* Calendar Card */}
                <Card className="flex-1 p-4 xl:p-6 min-w-0 overflow-hidden">
                  <div className="h-full flex flex-col min-w-0 overflow-hidden">
                    <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
                      <Calendar className="w-full h-full" />
                    </div>
                    <div className="mt-4 xl:mt-6 flex-shrink-0 min-w-0 overflow-hidden">
                      <div className="rounded-lg bg-muted/60 p-3 xl:p-4 min-w-0 overflow-hidden">
                        <span className="text-xs xl:text-sm font-semibold text-muted-foreground mb-2 xl:mb-3 block tracking-wide uppercase">
                          Public Holidays
                        </span>
                        <div className="space-y-1 xl:space-y-2 min-w-0 overflow-hidden">
                          {SPECIAL_HOLIDAYS.map(holiday => (
                            <div key={holiday.name} className="flex items-center gap-2 xl:gap-3 px-2 xl:px-3 py-1.5 xl:py-2 rounded-md xl:rounded-lg bg-primary/10 text-primary text-xs xl:text-sm min-w-0 overflow-hidden">
                              <span className="flex-1 truncate text-ellipsis whitespace-nowrap min-w-0 max-w-[180px] xl:max-w-[240px]">{holiday.name}</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0 truncate text-ellipsis whitespace-nowrap max-w-[80px]">{holiday.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Notes Card - Responsive width */}
                <Card className="w-72 xl:w-80 p-4 xl:p-6 flex-shrink-0">
                  <h2 className="text-lg xl:text-2xl font-semibold mb-3 xl:mb-4 text-primary">Temporary Note</h2>
                  <Textarea
                    className="resize-none w-full h-full border-none bg-muted/90 rounded-lg text-sm xl:text-base"
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