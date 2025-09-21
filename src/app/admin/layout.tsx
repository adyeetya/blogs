// Protect all /admin routes: redirect to /admin/login if not authenticated
// This layout wraps all admin pages

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { SERVER_URL } from "@/config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    // Don't check token on /admin/login
    if (pathname.startsWith("/admin/login")) return;
    // Check for token in localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    // Verify token with backend
    const verify = async () => {
      try {
        await axios.post(`${SERVER_URL}/api/auth/admin/verify`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
      }
    };
    verify();
  }, [pathname, router]);

  return <>{children}</>;
}
