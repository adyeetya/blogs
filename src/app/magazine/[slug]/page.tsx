"use client";

import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";

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

  // Responsive sizing based on window width
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile
        setDimensions({ width: w * 0.9, height: w * 0.9 * (4 / 3) });
      } else if (w < 1024) {
        // Tablet
        setDimensions({ width: w * 0.7, height: w * 0.7 * (4 / 3) });
      } else {
        // Laptop/desktop
        const maxWidth = 500;
        console.log({ width: maxWidth, height: maxWidth * (4 / 3) });
        setDimensions({ width: maxWidth, height: maxWidth * (4 / 3) });
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
    <div className="flex flex-col items-center my-8 px-2 max-w-full bg-red-500">
      <HTMLFlipBook
        width={dimensions.width}
        height={dimensions.height}
        ref={flipBookRef}
        onFlip={onPageFlip}
        showCover={true}
        className="shadow-lg rounded-md"
        flippingTime={400}
        // autoSize={false}
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
              className="object-contain w-full h-full "
            />
          </div>
        ))}
      </HTMLFlipBook>

      {/* Navigation Controls */}
      <div className="mt-4 flex items-center gap-6 select-none">
        <button
          onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        <span>
          Page{" "}
          <span className="font-semibold">
            {currentPage + 1} / {totalPages}
          </span>
        </span>

        <button
          onClick={() => flipBookRef.current?.pageFlip().flipNext()}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageFlipbook;
