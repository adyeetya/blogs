// app/about/page.tsx
import React from "react";

export const metadata = {
  title: "About Us | Founders Middle East",
  description:
    "Learn about Founders Middle East — an independent media network amplifying authentic stories from the Middle East.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-6 md:px-12 lg:px-24 py-20 text-foreground">
      <section className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-poppins font-semibold">
          About Us
        </h1>

        <p className="text-lg leading-relaxed font-inter">
          <span className="text-orange-600 font-semibold">
            Founders Middle East
          </span>{" "}
          is an independent media network dedicated to telling impactful,
          forward-looking stories from across the Middle East. We spotlight
          founders, creators, innovators, and changemakers shaping the region’s
          economic, cultural, and digital future.
        </p>

        <p className="text-lg leading-relaxed font-inter">
          Our mission is to reframe the global narrative of the Middle East —
          moving beyond stereotypes and showcasing the real voices driving
          transformation. Through deep storytelling, data-backed insights, and
          visually compelling formats, we bring audiences closer to the new
          Middle East.
        </p>

        <p className="text-lg leading-relaxed font-inter">
          Whether it&apos;s entrepreneurship, relocation, tech, culture, lifestyle,
          or regional opportunities — we publish stories designed to inspire,
          inform, and empower.
        </p>

        <div className="pt-6 border-l-4 border-orange-500 pl-4">
          <h2 className="text-2xl font-semibold font-poppins mb-3">
            What We Stand For
          </h2>
          <ul className="space-y-3 text-lg font-inter">
            <li>• Authentic, original storytelling</li>
            <li>• Data-driven reporting</li>
            <li>• Founder-first journalism</li>
            <li>• Cross-cultural connection</li>
            <li>• Ethical and independent media</li>
          </ul>
        </div>

        <p className="text-lg font-inter pt-4">
          We are building a platform that connects South Asia, the Middle East,
          and the world — one story at a time.
        </p>
      </section>
    </main>
  );
}
