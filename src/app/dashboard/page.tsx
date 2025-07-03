"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardMain from "@/components/dashboard/DashboardMain";

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/sign-in");
      }
    }
  }, [router]);
  return <DashboardMain />;
} 