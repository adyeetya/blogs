"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import axios from "axios";
import { useParams } from "next/navigation";
import { SERVER_URL } from "@/config";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  const [isFlipping, setIsFlipping] = useState(false);
  const flipBookRef = useRef(null);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

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
          setCurrentPage(0);
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

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w < 640) {
        // Mobile: single page view with appropriate sizing
        const maxWidth = Math.min(w * 0.92, 400);
        console.log('maxWidth', w, maxWidth);
        const width = maxWidth;
        const height = width * (4 / 3);
        setDimensions({ width, height });
      } else if (w < 1024) {
        // Tablet: single page view or spread based on orientation
        const isPortrait = h > w;
        if (isPortrait) {
          const width = Math.min(w * 0.85, 600);
          const height = width * (4 / 3);
          setDimensions({ width, height });
        } else {
          // Landscape tablet shows spread
          const spreadWidth = Math.min(w * 0.9, 1000);
          const pageWidth = spreadWidth / 2;
          const height = pageWidth * (4 / 3);
          setDimensions({ width: pageWidth, height });
        }
      } else {
        // Desktop: spread view
        const spreadWidth = Math.min(w * 0.8, 1200);
        const pageWidth = spreadWidth / 2;
        const height = pageWidth * (4 / 3);
        setDimensions({ width: pageWidth, height });
      }
    }

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // const onPageFlip = (e) => {
  //   setCurrentPage(e.data);
  // };

  const onFlipStart = () => {
    setIsFlipping(true);
    document.body.style.overflow = "hidden";
  };

  const onFlipEnd = () => {
    setIsFlipping(false);
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 100);
  };

  const onPageFlip = (e) => {
    setCurrentPage(e.data);

    // Prevent automatic scrolling on mobile
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 100);
    }
  };

  const totalPages = pages.length;

  return (
    <div ref={containerRef} className="mt-16 flex flex-col items-center w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-4 bg-white rounded-lg overflow-hidden">
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

      {/* Flipbook Container - FIXED FOR MOBILE */}
      <div className="md:w-full w-[350px]  flex flex-col items-center justify-center mb-4 overflow-hidden">
        <div
          className="flex justify-center items-center w-full"
          style={{
            height: dimensions.height + 40,
            minHeight: "400px",
          }}
        >
          <HTMLFlipBook
            width={dimensions.width}
            height={dimensions.height}
            minWidth={280}
            maxWidth={800}
            minHeight={380}
            maxHeight={1200}
            size="stretch"
            drawShadow={true}
            useMouseEvents={true}
            showCover={true}
            mobileScrollSupport={true}
            ref={flipBookRef}
            onFlip={onPageFlip}
            onFlipStart={onFlipStart}
            onFlipEnd={onFlipEnd}
            className="shadow-2xl  rounded-lg border border-orange-600/10"
            flippingTime={600}
            usePortrait={true}
            maxShadowOpacity={0.3}
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            {pages.map((src, i) => (
              <div
                key={i}
                className="flex justify-center max-w-[90vw] items-center  p-1 demoPage"
                style={{
                  height: "100%",
                  width: "100%",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={src}
                  alt={`Page ${i + 1}`}
                  loading="eager"
                  decoding="async"
                  className="object-contain max-w-[90vw] w-full h-full"
                  style={{
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    imageRendering: "crisp-edges",
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        {/* Navigation Controls */}
        <div className="mt-4 flex items-center gap-4 md:gap-6 select-none">
          <button
            onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
            disabled={currentPage === 0 || isFlipping}
            className="px-4 py-2 text-sm md:text-base font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400 hover:bg-orange-700 active:scale-95"
          >
            Previous
          </button>

          <span className="text-xs md:text-lg font-medium text-orange-700 bg-orange-100 px-2 md:px-4 py-1 rounded-full shadow">
            {currentPage === 0 || currentPage === totalPages - 1 ? (
              <>
                Page{" "}
                <span className="font-bold text-orange-900">
                  {currentPage + 1} / {totalPages}
                </span>
              </>
            ) : (
              <>
                Page{" "}
                <span className="font-bold text-orange-900">
                  {currentPage + 1}-{currentPage + 2} / {totalPages}
                </span>
              </>
            )}
          </span>

          <button
            onClick={() => flipBookRef.current?.pageFlip().flipNext()}
            disabled={currentPage >= totalPages - 1 || isFlipping}
            className="px-4 py-2 text-sm md:text-base font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400 hover:bg-orange-700 active:scale-95"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add CSS for better mobile experience */}
      <style jsx>{`
        @media (max-width: 640px) {
          :global(.page-flip .page) {
            box-shadow: none !important;
          }
          
          :global(.page-flip .shadow) {
            display: none !important;
          }
        }
        
        .demoPage {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        @media (max-width: 640px) {
          :global(body.flipping) {
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageFlipbook;