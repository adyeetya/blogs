"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { useParams } from "next/navigation";
import axios from "axios";
import { SERVER_URL } from "@/config";
const mockMagazineData = {
  title: "Modern Living Magazine",
  dateOfPublish: "June 2025",
  author: "Jane Doe",
  keywords: ["Design", "Architecture", "Lifestyle", "Trends"],
  coverSummary:
    "An exclusive look at contemporary living trends, insightful interviews, and the latest in design inspiration.",
  publisher: "Living Media",
};

const ImageFlipbook = () => {
  const params = useParams();
  const slug = useMemo(() => String(params?.slug || ""), [params]);
  const [pages, setPages] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  // const [pages, setPages] = useState([
  //   "/images/9f08ed016e480b052a02dc76fa54b5c7.jpg",
  //   "/images/1131w-71rDOkWy3kc.webp",
  //   "/images/1131w-lqndjVe3Zp0.webp",
  //   "/images/1236w-Db_Tlf86cmE.webp",
  //   "/images/9f08ed016e480b052a02dc76fa54b5c7.jpg",
  //   "/images/1131w-71rDOkWy3kc.webp",
  //   "/images/1131w-lqndjVe3Zp0.webp",
  //   "/images/1236w-Db_Tlf86cmE.webp",
  //   "/images/9f08ed016e480b052a02dc76fa54b5c7.jpg",
  //   "/images/1131w-71rDOkWy3kc.webp",
  //   "/images/1131w-lqndjVe3Zp0.webp",
  //   "/images/1236w-Db_Tlf86cmE.webp",
  //   "/images/9f08ed016e480b052a02dc76fa54b5c7.jpg",
  //   "/images/1131w-71rDOkWy3kc.webp",
  //   "/images/1131w-lqndjVe3Zp0.webp",
  //   "/images/1236w-Db_Tlf86cmE.webp",
  // ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  const [isFlipping, setIsFlipping] = useState(false);
  const flipBookRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      console.log("Loading magazine for slug:", slug);
      if (!slug) return;
      setLoading(true);
      setErrMsg("");
      try {
        const res = await axios.get(`${SERVER_URL}/api/magazines/${slug}`, {
          withCredentials: true,
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
        if (!ignore)
          setErrMsg(e?.response?.data?.message || "Failed to load magazine");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [slug]);

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w < 640) {
        // Mobile: single page with max height constraint
        const maxHeight = h * 0.7; // Use 70% of screen height
        const calculatedHeight = Math.min(w * 0.95 * (4 / 3), maxHeight);
        const calculatedWidth = calculatedHeight * (3 / 4); // Maintain aspect ratio

        setDimensions({
          width: calculatedWidth,
          height: calculatedHeight,
        });
      } else if (w < 1024) {
        // Tablet: spread two pages, slightly smaller
        setDimensions({
          width: Math.min(w * 0.93, 700),
          height: Math.min(w * 0.93, 700) * (4 / 3),
        });
      } else {
        // Desktop/Large: two big pages
        setDimensions({ width: 900, height: 400 * (4 / 3) });
      }
    }

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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

  const onFlipStart = () => {
    setIsFlipping(true);

    // Lock scroll during flip animation
    document.body.style.overflow = "hidden";
  };

  const onFlipEnd = () => {
    setIsFlipping(false);

    // Restore scroll after flip animation
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 100);
  };
  const scrollContainerRef = useRef(null);

  // Add this useEffect to maintain scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const savedScrollTop = container.scrollTop;

      // Restore scroll position after render
      requestAnimationFrame(() => {
        if (container.scrollTop !== savedScrollTop) {
          container.scrollTop = savedScrollTop;
        }
      });
    }
  }, [currentPage]);
  const totalPages = pages.length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <span>Loading magazine...</span>
      </div>
    );
  }

  // if (errMsg) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[100vh]">
  //       <span className="text-red-600">{errMsg}</span>
  //     </div>
  //   );
  // }

  // if (!meta) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[100vh]">
  //       <span>Magazine not found</span>
  //     </div>
  //   );
  // }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center max-w-6xl mx-auto py-10 px-4 bg-white rounded-lg shadow-md mt-16"
    >
      {/* Magazine Metadata - Reduced padding on mobile */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center md:items-start gap-6 mb-4 md:mb-8 bg-gradient-to-tr from-orange-600/20 via-white to-orange-100 rounded-xl p-4 md:p-6 border border-orange-100 shadow-sm">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-orange-600">
            {mockMagazineData.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm mb-3">
            <span className="px-2 py-0.5 bg-orange-600 text-white rounded">
              {mockMagazineData.dateOfPublish}
            </span>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-200">
              By {mockMagazineData.author}
            </span>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-200">
              Publisher: {mockMagazineData.publisher}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3 italic">
            {mockMagazineData.coverSummary}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {mockMagazineData.keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 font-medium shadow-sm border border-orange-200"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
        {/* Optional: Thumbnail/Logo or Cover */}
        <div className="w-28 h-36 md:w-32 md:h-44 rounded-lg overflow-hidden shadow-lg ring-2 ring-orange-200">
          <img
            src={pages[0]}
            alt="Magazine Cover"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Flipbook Section */}
      <div
        ref={scrollContainerRef}
        className="flex flex-col items-center w-full overflow-y-auto"
        style={{
          height: "calc(100vh - 200px)",
          minHeight: "500px",
          maxHeight: "800px",
        }}
      >
        <div
          className="flex flex-col items-center w-full"
          style={{
            height: "calc(100vh - 200px)",
            minHeight: "500px",
            maxHeight: "800px",
          }}
        >
          <HTMLFlipBook
            width={
              dimensions.width /
              (typeof window !== "undefined" && window.innerWidth >= 640
                ? 2
                : 1)
            } // single page on mobile
            height={dimensions.height}
            minWidth={200}
            maxWidth={1000}
            minHeight={300}
            maxHeight={600} // Limit max height on mobile
            size="stretch"
            drawShadow={true}
            useMouseEvents={true}
            showCover={true}
            mobileScrollSupport={true}
            ref={flipBookRef}
            onFlip={onPageFlip}
            onFlipStart={onFlipStart}
            onFlipEnd={onFlipEnd}
            className="shadow-2xl rounded-lg border border-orange-600/10 bg-orange-50"
            flippingTime={600}
            usePortrait={true}
            maxShadowOpacity={0.3}
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              height: "100%", // Take full height of parent
              width: "100%", // Take full width of parent
            }}
          >
            {pages.map((src, i) => (
              <div
                key={i}
                className="flex justify-center items-center bg-white p-2 demoPage"
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
                  loading="lazy"
                  className="object-contain w-full h-full"
                  style={{
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    maxHeight: "60vh", // Limit image height
                  }}
                />
              </div>
            ))}
          </HTMLFlipBook>

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center gap-8 select-none">
            <button
              onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
              disabled={currentPage === 0 || isFlipping}
              className="px-5 py-2 font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400 hover:bg-orange-700 active:scale-95 transition-transform"
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
              disabled={currentPage >= totalPages - 2 || isFlipping}
              className="px-5 py-2 font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400 hover:bg-orange-700 active:scale-95 transition-transform"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS for smoother animations */}
      <style jsx>{`
        .demoPage {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        /* Ensure pageflip container has proper 3D context */
        :global(.page-flip) {
          transform-style: preserve-3d;
        }

        /* Improve image rendering */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        /* Prevent scrolling during flip on mobile */
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
