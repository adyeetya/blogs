// components/NewsGrid.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from 'lucide-react'
import { useQuery, useInfiniteQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchLatestBlogs, fetchOlderBlogs } from '@/lib/blogsApi';
import { useState } from 'react';


const queryClient = new QueryClient();

function NewsGridContent() {
  const [page, setPage] = useState(1);
  const {
    data: latestData,
    isLoading: latestLoading,
    error: latestError,
  } = useQuery({
    queryKey: ['latest-blogs'],
    queryFn: fetchLatestBlogs,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const {
    data: olderData,
    isLoading: olderLoading,
    error: olderError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['older-blogs'],
    queryFn: fetchOlderBlogs,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  // Loading/Error states
  if (latestLoading || olderLoading) return <div className="py-16 text-center">Loading...</div>;
  if (latestError || olderError) return <div className="py-16 text-center text-red-500">Error loading blogs.</div>;

  // Latest blogs: show first one big, next two as side articles
  const latest = latestData?.blogs || [];
  const featured = latest[0];
  const side = latest.slice(1, 3);

  // Older blogs: flatten paginated data
  const older = olderData?.pages?.flatMap((p) => p.blogs) || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Latest Blogs */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Featured */}
          {featured && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden border-0 shadow-xl group cursor-pointer h-full">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={featured.image} 
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white border-0">
                    {featured.category}
                  </Badge>
                </div>
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {featured.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {featured.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {featured.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {featured.date}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          )}
          {/* Side Articles */}
          <div className="space-y-6">
            {side.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {item.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Older Blogs (Paginated) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {older.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white border-0">
                    {item.category}
                  </Badge>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3 mb-4">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {item.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.date}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No More Blogs'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function NewsGrid() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsGridContent />
    </QueryClientProvider>
  );
}
