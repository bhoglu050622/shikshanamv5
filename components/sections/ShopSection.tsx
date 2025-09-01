'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ArrowRight, Download, BookOpen, ShoppingBag, FileText, Star } from 'lucide-react'

const shopItems = [
  {
    category: 'FREE Digital Resources',
    items: [
      {
        name: 'Complete Vedanta Sutras Collection',
        description: 'Master the ultimate truth with expert commentaries',
        price: 'Free',
        icon: FileText,
        color: 'from-blue-400 to-indigo-500',
        popular: true
      },
      {
        name: 'Yoga Sutras Master Collection',
        description: 'Transform your life with Patanjali\'s complete wisdom',
        price: '₹299',
        icon: BookOpen,
        color: 'from-green-400 to-emerald-500'
      },
      {
        name: 'Sanskrit Wisdom Dictionary',
        description: 'Unlock the secrets of ancient philosophical terms',
        price: '₹199',
        icon: FileText,
        color: 'from-purple-400 to-violet-500'
      }
    ]
  },
  {
    category: 'Premium Physical Books',
    items: [
      {
        name: 'The Complete Six Darshanas',
        description: 'Master all schools of Indian philosophy in one collection',
        price: '₹1,499',
        icon: BookOpen,
        color: 'from-saffron-400 to-orange-500',
        popular: true
      },
      {
        name: 'Vedanta Mastery Guide',
        description: 'Step-by-step path to spiritual liberation',
        price: '₹899',
        icon: BookOpen,
        color: 'from-indigo-400 to-purple-500'
      }
    ]
  },
  {
    category: 'Sacred Tools & Merchandise',
    items: [
      {
        name: 'Spiritual Seeker Collection',
        description: 'Sacred designs that inspire your spiritual journey',
        price: '₹799',
        icon: ShoppingBag,
        color: 'from-saffron-400 to-red-500'
      },
      {
        name: 'Sacred Geometry Journal',
        description: 'Document your spiritual growth with sacred designs',
        price: '₹399',
        icon: ShoppingBag,
        color: 'from-indigo-400 to-blue-500'
      }
    ]
  }
]

export default function ShopSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    const initShopAnimation = async () => {
      const { gsap } = await import('gsap')
      
      if (ref.current && isInView) {
        const items = ref.current.querySelectorAll('.shop-item')
        
        gsap.fromTo(items,
          { 
            opacity: 0,
            y: 100,
            rotationY: 15
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 1,
            stagger: 0.1,
            ease: "backOut"
          }
        )
      }
    }

    initShopAnimation()
  }, [isInView])

  return (
    <section ref={ref} className="relative py-20 px-4 bg-gradient-to-br from-background-alt-light via-background-light to-background-alt-light dark:from-background-alt-dark dark:via-background-dark dark:to-background-alt-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-6"
          >
            Shop & Resource Library
          </motion.h2>
          <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
            <strong>Accelerate your spiritual journey</strong> with our exclusive collection of ancient texts, 
            modern interpretations, and sacred tools. <strong>Everything you need to master the Six Darshanas.</strong>
          </p>
        </motion.div>

        {/* Shop Categories */}
        <div className="space-y-16">
          {shopItems.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: categoryIndex * 0.2 }}
            >

              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIndex) => {
                  const IconComponent = item.icon
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: (categoryIndex * 0.2) + (itemIndex * 0.1) }}
                      className={`shop-item relative glass-effect p-6 rounded-2xl border border-white/10 dark:border-white/5 hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 backdrop-blur-sm ${
                        item.popular ? 'ring-2 ring-primary-light/50 dark:ring-primary-dark/50' : ''
                      }`}
                    >
                      {item.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4">
                          {item.description}
                        </p>
                        <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                          {item.price}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          item.price === 'Free'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                            : 'border border-primary-light/30 dark:border-primary-dark/30 text-primary-light dark:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark'
                        }`}
                      >
                        {item.price === 'Free' ? (
                          <>
                            <Download className="w-4 h-4" />
                            Download Free
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Offer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="glass-effect p-8 rounded-2xl border border-white/10 dark:border-white/5 backdrop-blur-sm max-w-4xl mx-auto">

            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6 text-lg">
              Get the complete "Six Darshanas Collection" with all digital resources included
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary-light dark:text-primary-dark">₹2,999</span>
              <span className="text-xl text-text-secondary-light/60 dark:text-text-secondary-dark/60 line-through">₹4,999</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                40% OFF
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 mx-auto ripple-button glow-border hover:shadow-xl transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              Get Complete Bundle
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
