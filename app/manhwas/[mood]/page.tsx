import { Bangers } from 'next/font/google'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Footer from '@/app/components/Footer'
import clientPromise from '@/lib/mongodb'
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

export default async function ManhwaPage({ params }: PageProps) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    if (!db) {
      throw new Error('Database connection failed')
    }
    
    const manhwas = await db.collection<Manhwa>('Manhwas')
      .find({ 
        moods: { 
          $regex: new RegExp(params.mood, 'i')
        } 
      })
      .toArray()

    if (manhwas.length === 0) {
      notFound()
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
          <Footer />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in ManhwaPage:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('bad auth') || errorMessage.includes('authentication failed')) {
      throw new Error('Database authentication failed. Please check your credentials.')
    }
    throw new Error(`Failed to load manhwas: ${errorMessage}`)
  }
}