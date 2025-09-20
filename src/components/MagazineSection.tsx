/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestMagazines } from "@/lib/magazinesApi";
import Image from "next/image";

export default function MagazineSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["latest-magazines"],
    queryFn: fetchLatestMagazines,
    staleTime: 1000 * 60 * 10,
  });

  const magazines = data?.data || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Magazines</h2>
            <p className="text-gray-600 mt-2">Explore our newest magazine issues</p>
          </div>
          <Button asChild variant="secondary" className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white">
            <Link href="/magazines">View All Magazines</Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">Failed to load magazines.</p>
          </div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No magazines found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {magazines.map((mag: any) => (
              <motion.div
                key={mag._id}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className="group cursor-pointer"
              >
                <Link href={`/magazine/${mag.slug}`} className="block h-full">
                  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden bg-white">
                    <div className="relative h-48 overflow-hidden">
                      {mag.coverImageUrl ? (
                        <img
                          src={mag.coverImageUrl}
                          alt={mag.title}
                          width={320}
                          height={192}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">No Cover</div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">
                        {mag.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-3 text-sm">
                        {mag.coverSummary || "No summary available."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          {mag.dateOfPublish ? new Date(mag.dateOfPublish).toLocaleDateString() : "N/A"}
                        </div>
                        <div>
                          {mag.author || "Unknown"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
