import { HomeIcon, FolderIcon, ListTodoIcon, CalendarIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/" },
  { label: "Projects", icon: FolderIcon, href: "/projects" },
  { label: "All Tasks", icon: ListTodoIcon, href: "/all-tasks" },
  { label: "Calendar", icon: CalendarIcon, href: "/calendar" },
  { label: "Settings", icon: SettingsIcon, href: "/settings" },
];

export default function Menubar() {
  const pathname = usePathname();
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col items-center py-8 px-2">
      <div className="text-2xl font-bold mb-10 tracking-tight text-primary flex items-center gap-2 select-none">
        <ListTodoIcon className="w-7 h-7" />
        Taskify
      </div>
      <nav className="flex flex-col gap-2 w-full">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            href={href}
            key={label}
            className={`flex items-center gap-3 px-5 py-3 rounded-lg font-medium transition-colors w-full text-left
              ${pathname === href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon className={`w-5 h-5 ${pathname === href ? "text-primary" : "text-muted-foreground"}`} />
            <span className="relative flex items-center">
              {label}
              {label === "Calendar" && (
                <span className="ml-2 inline-block align-middle">
                  <span className="bg-primary/10 text-primary text-[10px] font-semibold rounded px-1.5 pb-0.5 leading-none shadow-sm">new</span>
                </span>
              )}
            </span>
          </Link>
        ))}
      </nav>
      <div className="flex-1" />
      <div className="text-xs text-muted-foreground mt-10 select-none">v1.0.0</div>
    </aside>
  );
}