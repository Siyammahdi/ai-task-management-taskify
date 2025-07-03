import ComingSoon from "@/components/ui/ComingSoon";
import { FolderIcon } from "lucide-react";

export default function ProjectsPage() {
  return (
    <ComingSoon
      title="Projects"
      description="Organize your work into projects, track progress, and collaborate with your team. Project management features are on the way!"
      icon={<FolderIcon className="w-10 h-10" />}
    />
  );
} 