// components/NewsGrid.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from 'lucide-react'

const newsItems = [
  {
    id: 1,
    title: "Saudi's Surj Invests USD 40M in Professional Triathletes Organisation",
    description: "Saudi's Surj just secured a major investment deal. The company announced a USD 40 million investment...",
    category: "MARKETS",
    date: "Jul 28, 2025",
    author: "WAYA Staff",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Digital Payments Are Taking Over Egypt's SME Scene",
    description: "Visa, a global leader in payments, announced the launch of its new report, 'Value of Acceptance: Understanding the Digital...",
    category: "MARKETS", 
    date: "Jul 29, 2025",
    author: "WAYA Staff",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Saudi's Calo Raises USD 39M to Scale to AI-Powered Meal Platform",
    description: "Saudi's Calo just raised significant funding to expand their AI-powered meal delivery platform across the region...",
    category: "STARTUPS",
    date: "Jul 28, 2025", 
    author: "WAYA Staff",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "Saudi's Sawt Raises USD 1M to Scale AI-Powered Customer Service",
    description: "Saudi Arabia's Sawt has successfully raised USD 1 million in funding to expand their innovative AI-powered customer service platform...",
    category: "STARTUPS",
    date: "Jul 28, 2025",
    author: "WAYA Staff", 
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "Saudi Arabia Just Privatised Its First Sports Clubs",
    description: "In a groundbreaking move, Saudi Arabia has officially privatised its first sports clubs, marking a significant shift in the kingdom's sports industry...",
    category: "MARKETS",
    date: "Jul 27, 2025",
    author: "WAYA Staff",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=250&fit=crop"
  }
]

export default function NewsGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Featured Article (Large) */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
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
                  src={newsItems[1].image} 
                  alt={newsItems[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white border-0">
                  {newsItems[1].category}
                </Badge>
              </div>
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  {newsItems[1].title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {newsItems[1].description}
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {newsItems[1].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {newsItems[1].date}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Side Articles */}
          <div className="space-y-6">
            {newsItems.slice(0, 2).map((item, index) => (
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

        {/* Bottom Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.slice(2).map((item, index) => (
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
      </div>
    </section>
  )
}
