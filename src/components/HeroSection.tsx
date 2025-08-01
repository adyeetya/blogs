// components/HeroSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from 'lucide-react'

export default function HeroSection() {
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
              <span className="text-orange-500">WAYA</span> Media
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search stories, topics, or regions..."
                className="w-full px-6 py-4 text-lg rounded-full border-2 bg-card text-card-foreground focus:border-orange-500 focus:outline-none shadow-lg transition-all duration-300"
                style={{ borderColor: 'rgb(var(--border))' }}
              />
              <Button
                size="lg"
                className="absolute right-2 top-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
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
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8"
                style={{ 
                  borderColor: 'rgb(var(--color-orange-500))',
                  color: 'rgb(var(--color-orange-500))'
                }}
              >
                Watch Video Content
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
