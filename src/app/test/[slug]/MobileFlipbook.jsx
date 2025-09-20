"use client";

import React, { useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const MobileFlipbook = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipBookRef = useRef(null);
  const containerRef = useRef(null);
  const totalPages = pages.length;

  // Calculate dimensions for mobile
  const getMobileDimensions = () => {
    if (typeof window === "undefined") return { width: 300, height: 400 };
    
    const windowWidth = window.innerWidth;
    const width = Math.min(windowWidth * 0.92, 400);
    const height = width * (4 / 3);
    
    return { width, height };
  };

  const [dimensions, setDimensions] = useState(getMobileDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getMobileDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFlipStart = () => {
    setIsFlipping(true);
  };

  const onFlipEnd = () => {
    setIsFlipping(false);
  };

  const onPageFlip = (e) => {
    setCurrentPage(e.data);
    
    // Scroll to keep the flipbook in view
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, 100);
  };

  const goToPrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  // Handle swipe gestures for mobile
  const handleTouchStart = (e) => {
    // Only handle swipes if we're not in a flip animation
    if (!isFlipping) {
      const touchStartX = e.touches[0].clientX;
      e.currentTarget.dataset.touchStartX = touchStartX;
    }
  };

  const handleTouchEnd = (e) => {
    if (isFlipping) return;
    
    const touchStartX = parseFloat(e.currentTarget.dataset.touchStartX || "0");
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    // Swipe threshold
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Right swipe - previous page
        goToPrevPage();
      } else {
        // Left swipe - next page
        goToNextPage();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center mb-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-center items-center w-full" style={{ height: dimensions.height + 40 }}>
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          minWidth={280}
          maxWidth={400}
          minHeight={380}
          maxHeight={533}
          size="stretch"
          drawShadow={true}
          useMouseEvents={true}
          showCover={true}
          mobileScrollSupport={true}
          ref={flipBookRef}
          onFlip={onPageFlip}
          onFlipStart={onFlipStart}
          onFlipEnd={onFlipEnd}
          className="shadow-xl rounded-lg border border-orange-600/10"
          flippingTime={500}
          usePortrait={true}
          maxShadowOpacity={0.2}
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {pages.map((src, i) => (
            <div
              key={i}
              className="flex justify-center items-center p-1 demoPage"
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
                className="object-contain w-full h-full"
                style={{
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  // Improved image rendering properties
                  imageRendering: "high-quality",
                  transformOrigin: "center",
                }}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* Page Indicator */}
      <div className="flex items-center justify-center my-3">
        <span className="text-sm font-medium text-orange-700 bg-orange-100 px-3 py-1 rounded-full shadow">
          Page <span className="font-bold">{currentPage + 1}</span> of <span className="font-bold">{totalPages}</span>
        </span>
      </div>

      {/* Thumbnail Navigation */}
      <div className="w-full max-w-md overflow-x-auto py-2 mb-2">
        <div className="flex space-x-2 px-2 justify-center">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isFlipping) {
                  flipBookRef.current.pageFlip().flip(index);
                }
              }}
              className={`w-10 h-14 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                currentPage === index 
                  ? "border-orange-600 scale-110" 
                  : "border-gray-300 opacity-70"
              }`}
            >
              <img
                src={pages[index]}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                // Improved thumbnail quality
                style={{ imageRendering: "high-quality" }}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 mt-2 select-none">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0 || isFlipping}
          className="px-4 py-2 text-sm font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400 hover:bg-orange-700 active:scale-95"
        >
          Previous
        </button>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          className="px-4 py-2 text-sm font-semibold rounded-lg shadow transition-colors bg-orange-600 text-white disabled:bg-orange-200 disabled:text-orange-400 hover:bg-orange-700 active:scale-95"
        >
          Next
        </button>
      </div>

      {/* Mobile-specific styles with improved image quality */}
      <style jsx>{`
        :global(.page-flip .page .page-content) {
          box-shadow: none !important;
        }
        
        :global(.page-flip .shadow) {
          display: none !important;
        }
        
        :global(.page-flip .page) {
          background-color: white;
          border-radius: 4px;
          overflow: hidden;
        }
        
        :global(.page-flip .page.-hard) {
          background-color: #f3f4f6;
          box-shadow: none !important;
        }
        
        /* Improved image quality */
        :global(.page-flip .page img) {
          image-rendering: -webkit-optimize-contrast !important;
          image-rendering: crisp-edges !important;
          image-rendering: high-quality !important;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* Prevent blurry transforms */
        :global(.page-flip .page) {
          -webkit-font-smoothing: subpixel-antialiased;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default MobileFlipbook;