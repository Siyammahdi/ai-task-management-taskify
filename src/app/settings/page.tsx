import ComingSoon from "@/components/ui/ComingSoon";
import { SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Customize your experience, manage preferences, and configure your workspace. Settings are coming soon!"
      icon={<SettingsIcon className="w-10 h-10" />}
    />
  );
} 