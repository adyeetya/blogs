// components/Navigation.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Menu, X, Search, Sun, Moon } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { useBlogSearch } from '@/lib/useBlogSearch'


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isReadHovered, setIsReadHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResults, setShowResults] = useState(false);
  const { data, isLoading } = useBlogSearch(
    { q: search, limit: 5 },
    !!search && searchOpen && showResults
  );

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const readDropdownItems = [
    { title: 'Markets', href: '#markets' },
    { title: 'Startups', href: '#startups' },
    { title: 'Technology', href: '#technology' },
    { title: 'Finance', href: '#finance' },
    { title: 'Business', href: '#business' },
    { title: 'Innovation', href: '#innovation' }
  ]

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-orange-500 dark:bg-orange-600 shadow-lg transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo & Nav Items */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <h1 className="text-2xl font-bold text-white tracking-wide">
                WAYA
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-baseline space-x-8">
              {/* READ Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsReadHovered(true)}
                onMouseLeave={() => setIsReadHovered(false)}
              >
                <motion.a
                  href="#read"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -2 }}
                  className="text-white hover:text-orange-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 uppercase tracking-wide cursor-pointer"
                >
                  READ
                </motion.a>

                {/* READ Dropdown Menu */}
                <AnimatePresence>
                  {isReadHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-50"
                    >
                      {readDropdownItems.map((item, index) => (
                        <motion.a
                          key={item.title}
                          href={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150"
                        >
                          {item.title}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Nav Items */}
              {['WATCH', 'ABOUT', 'MORE', 'CONTACT'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                  className="text-white hover:text-orange-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 uppercase tracking-wide"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Side - Search & Theme */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 hidden sm:flex items-center space-x-2 transition-colors duration-200"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Search</span>
              </Button>
            </motion.div>
      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
              onClick={e => e.stopPropagation()}
              autoComplete="off"
              onSubmit={e => {
                e.preventDefault();
                if (search.trim()) {
                  setShowResults(true);
                }
              }}
            >
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
                className="w-full px-6 py-4 text-lg rounded-full border-2 bg-card text-card-foreground focus:border-orange-500 focus:outline-none shadow mb-4"
                autoFocus
                autoComplete="off"
              />
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
                        onClick={() => {
                          setSearchOpen(false);
                          setShowResults(false);
                          setSearch('');
                          router.push(`/blogs/${blog.slug}`);
                        }}
                      >
                        {blog.title}
                      </button>
                    ))
                  ) : (!isLoading && search) ? (
                    <div className="px-6 py-4 text-gray-500">No results found.</div>
                  ) : null}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setSearchOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Search className="h-5 w-5 mr-1" />
                  Search
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 hidden sm:flex transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </motion.div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-orange-600 dark:hover:bg-orange-700"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-orange-600 dark:bg-orange-700 border-t border-orange-400 dark:border-orange-500"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile READ with submenu */}
                <div className="space-y-1">
                  <div className="text-white font-medium uppercase tracking-wide px-3 py-2 text-sm">
                    READ
                  </div>
                  <div className="pl-4 space-y-1">
                    {readDropdownItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block text-orange-100 hover:text-white px-3 py-1 text-sm transition-colors duration-150"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Other mobile nav items */}
                {['WATCH', 'ABOUT', 'MORE', 'CONTACT'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white hover:text-orange-100 block px-3 py-2 text-base font-medium uppercase tracking-wide transition-colors duration-150"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                ))}

                {/* Mobile Search & Theme */}
                <div className="border-t border-orange-400 dark:border-orange-500 pt-2 mt-2 flex space-x-4 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-orange-700 dark:hover:bg-orange-800 flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-white hover:bg-orange-700 dark:hover:bg-orange-800 flex items-center space-x-2"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
