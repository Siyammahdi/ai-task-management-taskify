import { HomeIcon, FolderIcon, ListTodoIcon, CalendarIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { label: "Projects", icon: FolderIcon, href: "/projects" },
  { label: "All Tasks", icon: ListTodoIcon, href: "/all-tasks" },
  { label: "Calendar", icon: CalendarIcon, href: "/calendar" },
  { label: "Settings", icon: SettingsIcon, href: "/settings" },
];

interface MenubarProps {
  onClose?: () => void;
}

export default function Menubar({ onClose }: MenubarProps) {
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
    onClose?.();
    router.push("/sign-in");
  };

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col items-center py-4 lg:py-8 px-2">
      <div className="text-xl lg:text-2xl font-bold mb-6 lg:mb-10 tracking-tight text-primary hidden lg:flex items-center gap-2 select-none">
        <ListTodoIcon className="w-6 h-6 lg:w-7 lg:h-7" />
        <span className="">Taskify</span>
      </div>
      <nav className="flex flex-col gap-2 w-full">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            href={href}
            key={label}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 lg:px-5 py-2.5 lg:py-3 rounded-lg font-medium transition-colors w-full text-left text-sm lg:text-base
              ${pathname === href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${pathname === href ? "text-primary" : "text-muted-foreground"}`} />
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
        <div className="flex items-center gap-3 w-full px-3 lg:px-4 py-2 rounded-xl bg-muted/40">
          <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
            <AvatarImage src={undefined} alt={user?.name || user?.username || "User"} />
            <AvatarFallback className="text-sm lg:text-base">{user?.name ? user.name[0] : user?.username ? user.username[0] : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold truncate text-sm lg:text-base">{user?.name || user?.username || "User"}</span>
            {user?.email && <span className="text-xs text-muted-foreground truncate">{user.email}</span>}
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 p-1.5 lg:p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOutIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2 select-none mb-20 md:mb-0">v1.0.0</div>
    </aside>
  );
}