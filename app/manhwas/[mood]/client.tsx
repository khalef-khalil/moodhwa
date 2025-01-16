'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManhwaCard from '@/app/components/ManhwaCard'
import LoadingSpinner from '@/app/components/LoadingSpinner'

interface Manhwa {
  _id: { $oid: string }
  image_url: string
  title: string
  release_year: string
  chapters: number
  status: string
  rating: number
  genres: string[]
  description_translations: {
    en: string
    ar: string
    ko: string
    ja: string
    es: string
    fr: string
  }
  moods: string[]
}

interface ManhwaClientPageProps {
  initialManhwas: Manhwa[]
}

export default function ManhwaClientPage({ initialManhwas }: ManhwaClientPageProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([])
  const [viewHistory, setViewHistory] = useState<number[]>([])
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading for smoother transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, []) // Empty dependency array for one-time execution

  if (isLoading) {
    return <LoadingSpinner />
  }

  const availableManhwas = initialManhwas.filter((_, index) => !hiddenIndices.includes(index))
  
  if (availableManhwas.length === 0 || currentIndex >= availableManhwas.length) {
    router.push('/')
    return null
  }

  const getOriginalIndex = (currentVisibleIndex: number) => {
    let count = 0
    let originalIndex = 0
    
    while (count < currentVisibleIndex) {
      if (!hiddenIndices.includes(originalIndex)) {
        count++
      }
      originalIndex++
    }
    
    while (hiddenIndices.includes(originalIndex)) {
      originalIndex++
    }
    
    return originalIndex
  }

  const currentManhwa = availableManhwas[currentIndex]

  const serializedManhwa = {
    id: currentManhwa._id.$oid,
    image_url: currentManhwa.image_url,
    title: currentManhwa.title,
    release_year: currentManhwa.release_year,
    chapters: currentManhwa.chapters,
    status: currentManhwa.status,
    rating: currentManhwa.rating,
    genres: currentManhwa.genres,
    description: currentManhwa.description_translations.en
  }

  const handleNext = () => {
    if (currentIndex < availableManhwas.length - 1) {
      setViewHistory([...viewHistory, currentIndex])
      setCurrentIndex(currentIndex + 1)
      setDirection(1)
    }
  }

  const handleHide = () => {
    const originalIndex = getOriginalIndex(currentIndex)
    setHiddenIndices([...hiddenIndices, originalIndex])
    
    if (currentIndex >= availableManhwas.length - 1) {
      setCurrentIndex(0)
    }
    setDirection(1)
  }

  const handlePrevious = () => {
    if (viewHistory.length > 0) {
      const prevIndex = viewHistory[viewHistory.length - 1]
      setViewHistory(viewHistory.slice(0, -1))
      setCurrentIndex(prevIndex)
      setDirection(-1)
    }
  }

  return (
    <ManhwaCard
      manhwa={serializedManhwa}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onHide={handleHide}
      canGoBack={viewHistory.length > 0}
      canGoNext={currentIndex < availableManhwas.length - 1}
      direction={direction}
    />
  )
} 