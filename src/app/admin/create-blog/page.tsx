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
  const [formKey, setFormKey] = useState(0); // for resetting BlogCreate

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
      toast?.success("Blog post created successfully!");
      setFormKey((k) => k + 1); // Reset the form
      // router.push("/admin/blogs");
    } catch (err: any) {
      console.error("Blog creation error:", err);
      // Show validation errors if present
      const details = err?.response?.data?.details;
      if (details && Array.isArray(details)) {
        toast?.error(
          <div>
            <div className="font-semibold mb-1">Validation Error:</div>
            <ul className="list-disc ml-5">
              {details.map((msg: string, idx: number) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        toast?.error(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to create blog post"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-background">
      <div className="container mx-auto py-8">
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
          type="button"
        >
          Back to Admin
        </button>
        <BlogCreate key={formKey} onSubmit={handleCreate} />
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
