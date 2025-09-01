'use client'

import { X, Check, AlertTriangle, Info, Copy } from 'lucide-react'
import { ModalOptions } from '@/types/guna-profiler'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  options?: ModalOptions
}

export function Modal({ isOpen, onClose, title, message, options }: ModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    if (options?.iconClass?.includes('check')) {
      return <Check className="w-6 h-6 text-green-600" />
    }
    if (options?.iconClass?.includes('exclamation')) {
      return <AlertTriangle className="w-6 h-6 text-yellow-600" />
    }
    if (options?.iconClass?.includes('times')) {
      return <X className="w-6 h-6 text-red-600" />
    }
    return <Info className="w-6 h-6 text-blue-600" />
  }

  const getIconBg = () => {
    if (options?.iconBg?.includes('green')) return 'bg-green-100'
    if (options?.iconBg?.includes('yellow')) return 'bg-yellow-100'
    if (options?.iconBg?.includes('red')) return 'bg-red-100'
    return 'bg-blue-100'
  }

  const handleCopyOtp = () => {
    if (options?.otp) {
      navigator.clipboard.writeText(options.otp)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-full max-w-sm shadow-lg rounded-2xl bg-white">
        <div className="mt-3 text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${getIconBg()} mb-4`}>
            {getIcon()}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <div className="mt-2 px-4 py-3">
            <p className="text-sm text-gray-600">{message}</p>
            {options?.otp && (
              <div className="mt-2 flex items-center justify-center">
                <span className="text-2xl font-bold tracking-widest text-gray-800">
                  {options.otp}
                </span>
                <button
                  onClick={handleCopyOtp}
                  className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 transition-colors"
                  title="Copy OTP"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="items-center px-4 py-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white text-base font-medium rounded-lg w-full shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareText: string
}

export function ShareModal({ isOpen, onClose, shareText }: ShareModalProps) {
  if (!isOpen) return null

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://shikshanam.in/guna-profiler/")
    // You might want to show a toast notification here
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-full max-w-sm shadow-lg rounded-2xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Share Your Results</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            <span className="mr-2">📱</span>
            WhatsApp
          </button>
          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <span className="mr-2">🐦</span>
            X / Twitter
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}

interface UpsellModalProps {
  isOpen: boolean
  onClose: () => void
  language: 'en' | 'hi'
  onEnroll: () => void
}

export function UpsellModal({ isOpen, onClose, language, onEnroll }: UpsellModalProps) {
  if (!isOpen) return null

  const content = {
    en: {
      title: "Unlock Your Full Potential",
      subtitle: "Your Guṇa profile is just the beginning. The 'Emotional Intelligence with Sāṅkhya' journey is your next step to mastering your inner world.",
      benefits: [
        "Transform knowledge into wisdom with guided practices.",
        "Learn to manage emotions and reduce stress effectively.",
        "Build deeper, more meaningful relationships.",
        "Master decision-making for a purpose-driven life."
      ],
      urgencyTitle: "Why Enroll Now?",
      urgency: "Understanding your Guṇas is the first step. True transformation happens when you apply this knowledge. Start today to build lasting balance and inner peace.",
      cta: "Enroll & Transform Now"
    },
    hi: {
      title: "अपनी पूरी क्षमता को अनलॉक करें",
      subtitle: "आपकी गुण प्रोफ़ाइल केवल शुरुआत है। 'सांख्य के साथ भावनात्मक बुद्धिमत्ता' यात्रा आपके आंतरिक दुनिया में महारत हासिल करने का अगला कदम है।",
      benefits: [
        "निर्देशित प्रथाओं के साथ ज्ञान को ज्ञान में बदलें।",
        "भावनाओं को प्रबंधित करना और तनाव को प्रभावी ढंग से कम करना सीखें।",
        "गहरे, अधिक सार्थक संबंध बनाएं।",
        "उद्देश्य-संचालित जीवन के लिए निर्णय लेने में महारत हासिल करें।"
      ],
      urgencyTitle: "अभी क्यों नामांकन करें?",
      urgency: "अपने गुणों को समझना पहला कदम है। सच्चा परिवर्तन तब होता है जब आप इस ज्ञान को लागू करते हैं। स्थायी संतुलन और आंतरिक शांति बनाने के लिए आज ही शुरू करें।",
      cta: "नामांकन करें और अभी बदलें"
    }
  }

  const t = content[language]

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-6 border-0 w-full max-w-lg shadow-2xl rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-2xl font-bold text-gray-800">{t.title}</h3>
          <p className="text-gray-600 mt-2 mb-6">{t.subtitle}</p>
        </div>
        <div className="space-y-3 text-left mb-6">
          {t.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-4 rounded-r-lg mb-6">
          <p className="font-bold">{t.urgencyTitle}</p>
          <p>{t.urgency}</p>
        </div>
        <div className="text-center">
          <button
            onClick={onEnroll}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            {t.cta} →
          </button>
        </div>
      </div>
    </div>
  )
}
