"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, BookOpen } from "lucide-react";

export default function AdminMainPage() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Optionally, you can show a loading spinner here while checking
  // Or show a welcome/dashboard
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center gap-6 min-w-[340px]">
        <div className="text-3xl font-bold mb-2">Welcome, Admin!</div>
        <div className="text-muted-foreground mb-4 text-center">Manage your content below:</div>
        <div className="flex flex-col gap-4 w-full">
          <a
            href="/admin/blogs"
            className="w-full px-6 py-3 rounded bg-orange-600 text-white text-center font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" /> Blogs
          </a>
          <a
            href="/admin/create-magazine"
            className="w-full px-6 py-3 rounded bg-orange-600 text-white text-center font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" /> Create Magazine
          </a>
        </div>
      </div>
    </div>
  );
}