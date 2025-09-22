"use client";

import React, { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const DesktopFlipbook = ({ pages }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const flipBookRef = useRef(null);
    const totalPages = pages.length;

    const onFlipStart = () => {
        setIsFlipping(true);
    };

    const onFlipEnd = () => {
        setIsFlipping(false);
    };

    const onPageFlip = (e) => {
        setCurrentPage(e.data);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center mb-4 overflow-hidden">
            <div
                className="flex justify-center items-center w-full "
                style={{
                    height: 750,
                    minHeight: "400px",
                }}
            >
                <HTMLFlipBook
                    width={550}
                    height={700}
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
    );
};

export default DesktopFlipbook;