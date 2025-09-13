// components/HeroSection.tsx
'use client'


import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { useBlogSearch } from '@/lib/useBlogSearch'


export default function HeroSection() {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Only fetch when search is not empty and showResults is true
  const { data, isLoading } = useBlogSearch(
    { q: search, limit: 5 },
    !!search && showResults
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      setShowResults(true);
    }
  };

  const handleResultClick = (slug: string) => {
    setShowResults(false);
    setSearch('');
    router.push(`/blogs/${slug}`);
  };

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="text-orange-500">Founders</span> <br /> Middle East
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Amplifying the new narrative of the Middle East through independent media, 
              creative storytelling, and innovative digital experiences.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <form className="relative" autoComplete="off" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowResults(false);
                }}
                onFocus={() => search && setShowResults(true)}
                placeholder="Search stories, topics, or regions..."
                className="w-full px-6 py-4 text-lg rounded-full border-2 bg-card text-card-foreground focus:border-orange-500 focus:outline-none shadow-lg transition-all duration-300"
                style={{ borderColor: 'rgb(var(--border))' }}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              {/* Results Dropdown */}
              {showResults && search && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 text-left max-h-72 overflow-y-auto">
                  {isLoading && (
                    <div className="px-6 py-4 text-gray-500">Searching...</div>
                  )}
                  {data && data.blogs && data.blogs.length > 0 ? (
                    data.blogs.map((blog: { slug: string; title: string }) => (
                      <button
                        key={blog.slug}
                        type="button"
                        className="w-full text-left px-6 py-3 hover:bg-orange-50 focus:bg-orange-100 focus:outline-none transition-colors text-base border-b last:border-b-0 border-gray-100"
                        onClick={() => handleResultClick(blog.slug)}
                      >
                        {blog.title}
                      </button>
                    ))
                  ) : (!isLoading && search) ? (
                    <div className="px-6 py-4 text-gray-500">No results found.</div>
                  ) : null}
                </div>
              )}
            </form>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg px-8">
                Latest Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            
          </motion.div>
        </div>
      </div>
    </section>
  )
}
