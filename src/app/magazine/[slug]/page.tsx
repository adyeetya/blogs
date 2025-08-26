"use client";

import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";

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
  const [pages, setPages] = useState<string[]>([
    "/images/9f08ed016e480b052a02dc76fa54b5c7.jpg",
    "/images/1131w-71rDOkWy3kc.webp",
    "/images/1131w-lqndjVe3Zp0.webp",
    "/images/1236w-Db_Tlf86cmE.webp",
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile: single page
        setDimensions({ width: w * 0.95, height: w * 0.95 * (4 / 3) });
      } else if (w < 1024) {
        // Tablet: spread two pages, slightly smaller
        setDimensions({
          width: Math.min(w * 0.93, 700),
          height: Math.min(w * 0.93, 700) * (4 / 3),
        });
      } else {
        // Desktop/Large: two big pages
        setDimensions({ width: 900, height: 400 * (4 / 3) }); // width is spread (both pages together)
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onPageFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const totalPages = pages.length;

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto py-10 px-4 bg-white rounded-lg shadow-md mt-16">
      {/* Magazine Metadata / Details */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 bg-gradient-to-tr from-orange-600/20 via-white to-orange-100 rounded-xl p-6 border border-orange-100 shadow-sm">
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
      <div className="flex flex-col items-center w-full">
        <HTMLFlipBook
          width={dimensions.width / 2} // each page width
          height={dimensions.height}
          minWidth={200}
          maxWidth={1000}
          minHeight={300}
          maxHeight={1200}
          size="stretch"
          drawShadow={true}
          useMouseEvents={true}
          showCover={true}
          mobileScrollSupport={true}
          ref={flipBookRef}
          onFlip={onPageFlip}
          className="shadow-2xl rounded-lg border border-orange-600/10 bg-orange-50"
          flippingTime={400}
          style={{}}
        >
          {pages.map((src, i) => (
            <div
              key={i}
              className="flex justify-center items-center bg-white p-2"
              style={{ height: "100%", width: "100%" }}
            >
              <img
                src={src}
                alt={`Page ${i + 1}`}
                loading="lazy"
                className="object-contain w-full h-full transition-transform duration-300 "
              />
            </div>
          ))}
        </HTMLFlipBook>
        {/* Navigation Controls */}
        <div className="mt-6 flex items-center gap-8 select-none">
          <button
            onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
            disabled={currentPage === 0}
            className="px-5 py-2 font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400"
          >
            Previous
          </button>

          <span className="text-lg font-medium text-orange-700 bg-orange-100 px-4 py-1 rounded-full shadow">
            Page{" "}
            <span className="font-bold text-orange-900">
              {currentPage + 1} / {totalPages}
            </span>
          </span>

          <button
            onClick={() => flipBookRef.current?.pageFlip().flipNext()}
            disabled={currentPage === totalPages - 1}
            className="px-5 py-2 font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageFlipbook;
