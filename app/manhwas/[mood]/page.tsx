'use client'

import { Bangers } from 'next/font/google'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ManhwaCard from '@/app/components/ManhwaCard'
import Footer from '@/app/components/Footer'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/app/components/LoadingSpinner'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
})

interface PageProps {
  params: {
    mood: string
  }
}

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

export default function ManhwaListPage({ params }: PageProps) {
  const router = useRouter()
  const [manhwas, setManhwas] = useState<Manhwa[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([])
  const [viewHistory, setViewHistory] = useState<number[]>([])
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchManhwas() {
      try {
        const response = await fetch(`/api/manhwas?mood=${encodeURIComponent(params.mood)}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch manhwas')
        }
        const data = await response.json()
        setManhwas(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load manhwas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchManhwas()
  }, [params.mood])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const availableManhwas = manhwas.filter((_, index) => !hiddenIndices.includes(index))
  
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
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-violet-200 to-cyan-200 min-w-full">
      <div className="max-w-6xl mx-auto px-4 py-4 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-purple-600">•</span>
            <span className="text-purple-600">
              Sorted by highest rating
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-base ${bangers.className}`}>
              Feeling 😊 {decodeURIComponent(params.mood)}
            </span>
            <Link href="/">
              <Button 
                className={`${bangers.className} bg-purple-600 hover:bg-purple-700 text-white`}
              >
                EDIT MOOD
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <ManhwaCard
          manhwa={serializedManhwa}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onHide={handleHide}
          canGoBack={viewHistory.length > 0}
          canGoNext={currentIndex < availableManhwas.length - 1}
          direction={direction}
        />
      </div>
      <Footer />
    </div>
  )
}