'use client';

import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

const ImageFlipbook = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPages() {
      const res = await fetch('/api/flipbook-pages'); // Your API endpoint
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data: string[] = await res.json();
      setPages(data);
      setLoading(false);
    }
    fetchPages();
  }, []);

  if (loading) return <div className="text-center p-10">Loading flipbook...</div>;

  return (
    <div className="max-w-[600px] mx-auto my-8 h-[800px] shadow-lg rounded-md overflow-hidden">
      <HTMLFlipBook
        width={600}
        height={800}
        className=""
        style={{}}
        startPage={0}
        size="fixed"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}
        onFlip={() => {}}
      >
        {pages.map((src, i) => (
          <div key={i} className="flex justify-center items-center bg-white p-4" style={{ height: '100%', width: '100%' }}>
            <img src={src} alt={`Page ${i + 1}`} loading="lazy" className="object-contain w-full h-full" />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default ImageFlipbook;
