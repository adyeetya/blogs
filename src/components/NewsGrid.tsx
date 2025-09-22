/* eslint-disable @typescript-eslint/no-explicit-any */
// components/NewsGrid.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  useQuery,
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  fetchLatestBlogs,
  fetchOlderBlogs,
  fetchBlogsByCategory,
} from "@/lib/blogsApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { useState } from "react";

const queryClient = new QueryClient();

function NewsGridContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: latestData,
    isLoading: latestLoading,
    error: latestError,
  } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: fetchLatestBlogs,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: fetchCategories,
  });

  // Use different query based on whether a category is selected
  const {
    data: olderData,
    isLoading: olderLoading,
    error: olderError,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["older-blogs", selectedCategory],
    queryFn: ({ pageParam = 1 }) => {
      if (selectedCategory) {
        return fetchBlogsByCategory(selectedCategory, pageParam);
      } else {
        return fetchOlderBlogs({ pageParam });
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousPage ?? undefined,
    initialPageParam: 1,
  });

  // Loading/Error states
  if (latestLoading || olderLoading || categoriesLoading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm h-96"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (latestError || olderError) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-800">
              Error loading content
            </h3>
            <p className="mt-2 text-red-700">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Latest blogs: show first one big, next two as side articles
  const latest = latestData?.blogs || [];
  const featured = latest[0];
  const side = latest.slice(1, 3);

  // Older blogs: flatten paginated data
  const olderPages = olderData?.pages || [];
  const older = olderPages.flatMap((p) => p.blogs || []);
  const currentPage = olderData?.pageParams?.length || 1;
  const totalPages = olderPages[0]?.totalPages || 1;

  return (
   <>
  <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      {/* Section Header with Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Company Insights</h2>
          <p className="text-gray-600 mt-2">Latest news and updates from our team</p>
        </div>

        {/* Category Filter */}
        <div className="mt-4 md:mt-0">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 mr-3">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="rounded-full text-xs bg-orange-500 hover:bg-orange-600 text-white"
              >
                All Topics
              </Button>
              {categoriesData?.data?.map((category: any) => (
                <Button
                  key={category._id || category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="rounded-full text-xs"
                  style={
                    selectedCategory === category.name
                      ? { backgroundColor: category.color || '#ea580c', color: "white" }
                      : {}
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Article with Side Articles */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Featured Article - Takes 2/3 width */}
        <div className="lg:col-span-2">
          {featured && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href={`/blogs/${featured.slug}`} className="block group">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200 h-full">
                  <div className="aspect-video relative">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                        {featured.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">
                      {featured.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {featured.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1.5" />
                        <span>{featured.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        <span>{featured.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1.5" />
                        <span>{featured.readTime || "5 min"}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-orange-500 text-sm font-medium group-hover:text-orange-600 transition-colors">
                      <span className="mr-1.5">Read article</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Side Articles - Takes 1/3 width */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest Updates</h3>
          {side.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="group cursor-pointer"
            >
              <Link href={`/blogs/${item.slug}`} className="block">
                <div className="bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-28 h-24 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute -top-1 left-0">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-orange-500 text-white">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* More Articles Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-900">More Insights</h3>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              Clear Filter
            </Button>
          )}
        </div>

        {older.length > 0 ? (
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
                <Link href={`/blogs/${item.slug}`} className="block h-[90%]">
                  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <CardHeader className="p-2 pb-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-3 text-sm">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.readTime || "4 min read"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No articles found{" "}
              {selectedCategory ? `in ${selectedCategory} category` : "at the moment"}.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div className="text-sm text-gray-500">
          Showing {older.length} articles{" "}
          {selectedCategory ? `in ${selectedCategory}` : ""}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => fetchPreviousPage()}
            disabled={!hasPreviousPage || isFetchingPreviousPage}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center px-3 py-1 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md">
            Page {currentPage} {totalPages && `of ${totalPages}`}
          </div>

          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  </section>

  {/* Newsletter Subscription Section */}
  {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-50">
    <div className="max-w-3xl mx-auto text-center">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
        Stay Updated with Our Latest Insights
      </h3>
      <p className="text-gray-600 mb-8">
        Subscribe to our newsletter to receive industry news and company updates.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Subscribe</Button>
      </div>
    </div>
  </section> */}
</>
  );
}

export default function NewsGrid() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsGridContent />
    </QueryClientProvider>
  );
}
