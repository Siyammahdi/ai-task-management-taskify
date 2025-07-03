"use client";

import Menubar from "../../components/Menubar";
import { Card } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";

const SPECIAL_HOLIDAYS = [
  { name: "Eid ul Adha", date: "2024-06-17" },
  { name: "Eid ul Fitr", date: "2024-04-10" },

];

export default function CalendarPage() {
  const [note, setNote] = useState("");
  return (
    <div className="min-h-screen h-screen flex bg-background text-foreground w-full overflow-hidden">
      <div className="h-screen sticky top-0 left-0 z-10 w-64 flex-shrink-0">
        <Menubar />
      </div>
      <main className="flex-1 p-8 w-full h-screen overflow-hidden pb-8 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row gap-8 w-full h-full items-stretch justify-center">
          <Card className="flex-1 flex flex-col items-center justify-center p-12 min-w-[350px] min-h-[400px] h-full w-full shadow-xl">
            <div className="flex-1 flex items-center justify-center w-full">
              <Calendar className="w-full h-full rounded-xl ultra-calendar" />
            </div>
            <div className="w-full mt-8">
              <div className="rounded-xl bg-muted/60 p-4 flex flex-col items-center">
                <span className="text-sm font-semibold text-muted-foreground mb-2 tracking-wide uppercase">Public Holidays</span>
                <div className="flex flex-col gap-2 w-full">
                  {SPECIAL_HOLIDAYS.map(holiday => (
                    <div key={holiday.name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-base w-full">
                      <span className="flex-1">{holiday.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{holiday.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-8 flex flex-col h-full w-full shadow-xl">
            <h2 className="text-3xl font-semibold mb-2 text-primary">Temporary Note</h2>
            <Textarea
              className="resize-none min-h-[200px] border-none bg-muted/90 rounded-xl flex-1"
              placeholder="Write a quick note..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </Card>
        </div>
      </main>
      <style jsx global>{`
        .ultra-calendar .rdp {
          font-size: 1.5rem;
        }
        .ultra-calendar .rdp-table {
          min-width: 100%;
        }
        .ultra-calendar .rdp-day {
          min-width: 4rem;
          min-height: 4rem;
          font-size: 1.3rem;
        }
        .ultra-calendar .rdp-caption_label {
          font-size: 1.7rem;
          font-weight: 700;
        }
        .ultra-calendar .rdp-nav {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
} 