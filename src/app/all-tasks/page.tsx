import ComingSoon from "@/components/ui/ComingSoon";
import { ListTodoIcon } from "lucide-react";

export default function AllTasksPage() {
  return (
    <ComingSoon
      title="All Tasks"
      description="View and manage all your tasks in one place. A comprehensive task overview is coming soon!"
      icon={<ListTodoIcon className="w-10 h-10" />}
    />
  );
} 