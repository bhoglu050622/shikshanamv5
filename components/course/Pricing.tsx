'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Check, Star, Shield, CreditCard } from 'lucide-react'

interface PricingTier {
  id: string
  name: string
  price: number
  originalPrice?: number
  duration: string
  features: string[]
  popular?: boolean
  ctaText: string
  ctaLink: string
  savings?: number
  savingsPercentage?: number
}

interface PricingProps {
  title?: string
  subtitle?: string
  tiers: PricingTier[]
  showBundle?: boolean
  bundleOffer?: {
    title: string
    description: string
    originalPrice: number
    bundlePrice: number
    savings: number
    savingsPercentage: number
    ctaText: string
    ctaLink: string
  }
}

export default function Pricing({
  title = "Choose Your Learning Path",
  subtitle = "Select the perfect course option that fits your journey",
  tiers,
  showBundle = false,
  bundleOffer
}: PricingProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Bundle Offer */}
        {showBundle && bundleOffer && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-bg-tertiary/20" />
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Special Bundle Offer</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  {bundleOffer.title}
                </h3>
                
                <p className="text-lg mb-6 opacity-90">
                  {bundleOffer.description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold">
                        {formatPrice(bundleOffer.bundlePrice)}
                      </span>
                      <span className="text-lg line-through opacity-75">
                        {formatPrice(bundleOffer.originalPrice)}
                      </span>
                    </div>
                    <div className="bg-bg-primary/20 rounded-full px-4 py-1 text-sm font-medium">
                      Save {bundleOffer.savingsPercentage}% ({formatPrice(bundleOffer.savings)})
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
                  >
                    <a href={bundleOffer.ctaLink}>
                      {bundleOffer.ctaText}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${
                tier.popular ? 'lg:scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`bg-white dark:bg-gray-900 rounded-2xl p-8 h-full border-2 transition-all duration-300 hover:shadow-xl ${
                tier.popular 
                  ? 'border-orange-500 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500'
              }`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {tier.name}
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(tier.price)}
                      </span>
                      {tier.originalPrice && (
                        <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                          {formatPrice(tier.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400">
                      {tier.duration}
                    </p>
                    
                    {tier.savings && (
                      <div className="mt-2">
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                          Save {tier.savingsPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 ${
                    tier.popular
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  <a href={tier.ctaLink}>
                    {tier.ctaText}
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Security */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>Multiple Payment Options</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
