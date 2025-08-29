/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // needed for app directory, safe for both

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "@/config"; // adjust the import path as needed
import { AdminLogin } from "./AdminLogin";
import { Loader2 } from "lucide-react"; // optional: for loading spinner

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/admin/login`, data, {
        headers: { "Content-Type": "application/json" },
      });
      // Store token (adjust for your auth strategy: cookie, localStorage, etc.)
      localStorage.setItem("admin_token", res.data.data.token);
      // Redirect on success (adjust to your dashboard route)
      router.push("/admin/create-blog");
    } catch (err: any) {
      // Show the error using AdminLogin's error display
      throw err; // Let AdminLogin show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AdminLogin
          onLogin={async (data) => {
            try {
              await handleLogin(data);
            } catch (err: any) {
              // Error shown by the AdminLogin component via its own error state
              console.log(err)
            }
          }}
        />
        {loading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
