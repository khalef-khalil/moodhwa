'use client'

import { FourSquare } from 'react-loading-indicators'
import { Bangers } from 'next/font/google'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
})

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-violet-200 to-cyan-200 min-w-full flex flex-col items-center justify-center">
      <FourSquare color="#9333ea" size="medium" />
      <p className={`${bangers.className} mt-4 text-xl text-gray-700`}>
        Please wait while we fetch your manhwas
      </p>
    </div>
  )
} 