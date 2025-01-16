'use client'

import { Bangers } from 'next/font/google'
import MoodButton from './components/MoodButton'
import AnimatedContainer, { AnimatedItem } from './components/AnimatedContainer'
import Footer from '@/app/components/Footer'
import { useEffect } from 'react'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
})

const moods = [
  { text: "Gloomy", emoji: "☁️" },
  { text: "Angry", emoji: "😠" },
  { text: "Chill", emoji: "😎" },
  { text: "Irritated", emoji: "😤" },
  { text: "Sad", emoji: "😢" },
  { text: "Cheerful", emoji: "😊" },
  { text: "Depressed", emoji: "😔" },
  { text: "Hopeful", emoji: "🤞" },
  { text: "Humorous", emoji: "😂" },
  { text: "Idyllic", emoji: "🌈" },
  { text: "Romantic", emoji: "❤️" },
  { text: "Bitter", emoji: "😤" },
  { text: "Disgusted", emoji: "🤢" },
  { text: "Eerie", emoji: "👻" },
  { text: "Empathetic", emoji: "🤗" },
  { text: "Happy", emoji: "😄" },
  { text: "Lonely", emoji: "🥺" },
  { text: "Thrill-seeking", emoji: "🎢" },
  { text: "Fearful", emoji: "😨" }
]

export default function Home() {
  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      // Set the flag before reloading to prevent infinite loop
      localStorage.setItem('hasVisited', 'true')
      // Reload the page
      window.location.reload()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-violet-200 to-cyan-200 p-4 sm:p-6 md:p-12 flex flex-col">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 flex-grow">
        <AnimatedItem>
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight ${bangers.className}`}>
              Moodhwa
            </h1>
            <p className={`text-base sm:text-lg md:text-xl text-gray-600 mt-2 ${bangers.className}`}>
              Let Your Mood Set the Plot
            </p>
          </div>
        </AnimatedItem>

        <AnimatedItem>
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight ${bangers.className}`}>
              Discover top-rated manhwas based on your mood
            </h2>
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-700 ${bangers.className}`}>
              How are you feeling now?
            </p>
          </div>
        </AnimatedItem>

        <AnimatedContainer className="grid grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {moods.map((mood) => (
            <AnimatedItem key={mood.text} className="aspect-[5/3]">
              <MoodButton
                text={mood.text}
                emoji={mood.emoji}
              />
            </AnimatedItem>
          ))}
        </AnimatedContainer>
      </div>
      <Footer />
    </div>
  )
}
