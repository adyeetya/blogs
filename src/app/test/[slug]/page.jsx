"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { SERVER_URL } from "@/config";
import DesktopFlipbook from "./DesktopFlipbook";
import MobileFlipbook from "./MobileFlipbook";

const ImageFlipbook = () => {
  const params = useParams();
  const slug = useMemo(() => {
    const s = params?.slug;
    return typeof s === "string" ? s : Array.isArray(s) ? s[0] : "";
  }, [params]);

  const [pages, setPages] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
      };
      
      // Initial check
      checkIsMobile();
      
      // Add event listener for resize
      window.addEventListener("resize", checkIsMobile);
      
      // Cleanup
      return () => window.removeEventListener("resize", checkIsMobile);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrMsg("");

      try {
        const res = await axios.get(`${SERVER_URL}/api/magazines/${slug}`, {
          withCredentials: true,
          signal: controller.signal,
        });
        const data = res.data?.data;
        if (!ignore && data) {
          setMeta({
            title: data.title,
            dateOfPublish: new Date(data.dateOfPublish).toLocaleDateString(),
            author: data.author,
            publisher: data.publisher,
            coverSummary: data.coverSummary,
            keywords: data.keywords || [],
          });
          setPages((data.pages || []).map((p) => p.url).filter(Boolean));
        }
      } catch (e) {
        if (axios.isCancel(e)) {
          console.log("[Flipbook] Request canceled");
        } else if (!ignore) {
          console.error("[Flipbook] Load error:", e);
          setErrMsg(e?.response?.data?.message || e?.message || "Failed to load magazine");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [slug, params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading magazine</p>
          <p className="text-sm">{errMsg}</p>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-center">
          <p className="text-lg font-semibold">No pages found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 flex flex-col items-center w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-4 bg-white rounded-lg overflow-hidden">
      {/* Magazine Metadata */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-4 md:mb-6 bg-gradient-to-tr from-orange-600/20 via-white to-orange-100 rounded-xl p-4 md:p-6 border border-orange-100 shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl md:text-3xl font-bold mb-1 text-orange-600">{meta?.title || "Magazine"}</h1>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm mb-2">
            <span className="px-2 py-0.5 bg-orange-600 text-white rounded">{meta?.dateOfPublish || "-"}</span>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-200">By {meta?.author || "-"}</span>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-200">Publisher: {meta?.publisher || "-"}</span>
          </div>
          {!!meta?.coverSummary && <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 italic">{meta.coverSummary}</p>}
          {!!(meta?.keywords || []).length && (
            <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
              {meta.keywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 font-medium shadow-sm border border-orange-200">
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="w-20 h-28 md:w-32 md:h-44 rounded-lg overflow-hidden shadow-lg ring-2 ring-orange-200">
          <img
            src={pages[0] || "/placeholder.png"}
            alt="Magazine Cover"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Render appropriate flipbook based on screen size */}
      {isMobile ? (
        <MobileFlipbook pages={pages} />
      ) : (
        <DesktopFlipbook pages={pages} />
      )}
    </div>
  );
};

export default ImageFlipbook;