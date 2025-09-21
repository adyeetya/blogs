/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SERVER_URL } from "../../../config";
import MagazineCreate from "./MagazineCreate";

export default function MagazineCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleCreate = async (payload: any) => {
    setLoading(true);
    try {
  const token = localStorage.getItem("admin_token");

      // 1) Create magazine metadata
      const metaRes = await axios.post(
        `${SERVER_URL}/api/magazines`,
        {
          title: payload.title,
          slug: payload.slug,
          dateOfPublish: payload.dateOfPublish,
          author: payload.author,
          publisher: payload.publisher,
          coverSummary: payload.coverSummary || "",
          keywords: payload.keywords?.length ? payload.keywords : [],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // 2) Upload PDF to process pages (if provided)
      if (payload.pdfFile) {
        const fd = new FormData();
        fd.append("pdf", payload.pdfFile);
        await axios.post(
          `${SERVER_URL}/api/magazines/${payload.slug}/pdf`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      }

      toast.success("Magazine created successfully!");
      setFormKey((k) => k + 1);
      // router.push("/admin/magazines"); // adjust to listing route
    } catch (err: any) {
      const details = err?.response?.data?.details;
      if (Array.isArray(details)) {
        toast.error(
          <div>
            <div className="font-semibold mb-1">Validation Error</div>
            <ul className="list-disc ml-5">
              {details.map((msg: string, idx: number) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        toast.error(err?.response?.data?.message || err?.message || "Failed to create magazine");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-background">
      <div className="container mx-auto py-8">
        <button
          onClick={() => router.push('/admin')}
          className="mb-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
          type="button"
        >
        Back to Admin
        </button>
        <MagazineCreate key={formKey} onSubmit={handleCreate} loading={loading} />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin" />
            <span>Creating magazine...</span>
          </div>
        </div>
      )}
    </div>
  );
}
