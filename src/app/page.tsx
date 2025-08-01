// app/page.tsx
'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import NewsGrid from '@/components/NewsGrid'
import HeroSection from '@/components/HeroSection'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="overflow-hidden"
      >
        <HeroSection />
        <NewsGrid />
      </motion.main>
    </div>
  )
}
