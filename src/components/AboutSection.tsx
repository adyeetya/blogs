// components/AboutSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Users, Globe, TrendingUp } from 'lucide-react'

export default function AboutSection() {
  const features = [
    {
      icon: Users,
      title: "Community Focused",
      description: "Building bridges between cultures and communities across the region"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting local stories with international audiences worldwide"
    },
    {
      icon: TrendingUp,
      title: "Innovation Driven",
      description: "Leveraging cutting-edge technology to transform media experiences"
    }
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About WAYA Media
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We are an independent media and entertainment network amplifying the new narrative 
              of the Middle East. Our network is home to digital media brands, a creative studio, 
              and events division that connect stories across cultures.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Through innovative storytelling and cutting-edge digital experiences, we&apos;re 
              reshaping how the world sees and understands the Middle East region.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
