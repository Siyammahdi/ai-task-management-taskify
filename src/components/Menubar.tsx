import { HomeIcon, FolderIcon, ListTodoIcon, CalendarIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/" },
  { label: "Projects", icon: FolderIcon, href: "/projects" },
  { label: "All Tasks", icon: ListTodoIcon, href: "/all-tasks" },
  { label: "Calendar", icon: CalendarIcon, href: "/calendar" },
  { label: "Settings", icon: SettingsIcon, href: "/settings" },
];

export default function Menubar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; username?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          type DecodedUser = { name?: string; email?: string; username?: string };
          const decoded = jwtDecode<DecodedUser>(token);
          setUser({
            name: decoded.name,
            email: decoded.email,
            username: decoded.username,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    router.push("/sign-in");
  };

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
      <div className="w-full flex flex-col items-center gap-3 mb-4">
        <div className="flex items-center gap-3 w-full px-4 py-2 rounded-xl bg-muted/40">
          <Avatar>
            <AvatarImage src={undefined} alt={user?.name || user?.username || "User"} />
            <AvatarFallback>{user?.name ? user.name[0] : user?.username ? user.username[0] : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold truncate">{user?.name || user?.username || "User"}</span>
            {user?.email && <span className="text-xs text-muted-foreground truncate">{user.email}</span>}
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2 select-none">v1.0.0</div>
    </aside>
  );
}