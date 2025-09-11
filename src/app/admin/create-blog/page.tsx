/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BlogCreate } from "./BlogCreate";
import { SERVER_URL } from "../../../config";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Optional: for better notifications

export default function BlogCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      console.log("Creating blog with data:", data);
      
      const response = await axios.post(`${SERVER_URL}/api/blogs`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      console.log("Blog created successfully:", response.data);
      // Optional: Show success message
      toast?.success("Blog post created successfully!");
      
      // Redirect to admin blogs list
      // router.push("/admin/blogs");
    } catch (err: any) {
      console.error("Blog creation error:", err);
      toast?.error(err?.response?.data?.message || "Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <BlogCreate onSubmit={handleCreate} />
        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" />
              <span>Creating blog post...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
