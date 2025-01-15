'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, EyeOff } from 'lucide-react'
import { Bangers } from 'next/font/google'
import Image from 'next/image'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
})

export interface ManhwaCardProps {
  manhwa: {
    id: string
    image_url: string
    title: string
    release_year: string
    chapters: number
    status: string
    rating: number
    genres: string[]
    description: string
  }
  onPrevious: () => void
  onNext: () => void
  onHide: () => void
  canGoBack: boolean
  canGoNext: boolean
  direction: number
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
}

export default function ManhwaCard({ 
  manhwa, 
  onPrevious, 
  onNext, 
  onHide,
  canGoBack,
  canGoNext,
  direction 
}: ManhwaCardProps) {
  return (
    <motion.div
      key={manhwa.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.3 }
      }}
      className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative bg-gray-900 md:w-[400px] shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full aspect-[3/4] relative"
          >
            <Image
              src={manhwa.image_url || "/placeholder.svg"}
              alt={manhwa.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </motion.div>
        </div>

        {/* Manhwa Details */}
        <div className="p-6 flex flex-col flex-grow">
          <h1 className={`text-3xl font-bold ${bangers.className} mb-4`}>
            {manhwa.title}
          </h1>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span>{manhwa.release_year}</span>
            <span>•</span>
            <span>{manhwa.chapters}+ chapters</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ⭐ {manhwa.rating.toFixed(1)}/10
            </span>
            <span>•</span>
            <span className="text-purple-600 font-medium">{manhwa.status}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {manhwa.genres.map((genre, i) => (
              <div key={i} className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm">
                {genre}
              </div>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed text-sm flex-grow">
            {manhwa.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              size="lg"
              className={`gap-2 ${bangers.className} ${!canGoBack ? 'opacity-50' : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-transparent'}`}
              disabled={!canGoBack}
              onClick={onPrevious}
            >
              <ArrowLeft className="w-5 h-5" />
              PREVIOUS
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className={`gap-2 ${bangers.className}`}
              onClick={onHide}
            >
              <EyeOff className="w-5 h-5" />
              HIDE
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className={`gap-2 ${bangers.className} ${!canGoNext ? 'opacity-50' : 'hover:bg-gradient-to-l hover:from-purple-500/10 hover:to-transparent'}`}
              disabled={!canGoNext}
              onClick={onNext}
            >
              NEXT
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}