'use client'

import { Bangers } from 'next/font/google'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Footer from '@/app/components/Footer'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import ManhwaClientPage from './client'

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

export default function ManhwaPage({ params }: PageProps) {
  const [manhwas, setManhwas] = useState<Manhwa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Delay data fetching by 5 seconds
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/manhwas?mood=${encodeURIComponent(params.mood)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch manhwas')
        }
        const data = await response.json()
        setManhwas(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load manhwas')
      } finally {
        setIsLoading(false)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [params.mood])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Sort manhwas by rating (highest to lowest)
  const sortedManhwas = manhwas.sort((a, b) => b.rating - a.rating)

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
        <ManhwaClientPage initialManhwas={sortedManhwas} />
      </div>
      <Footer />
    </div>
  )
}