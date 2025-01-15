import { Bangers } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
})

export default function Footer() {
  return (
    <footer className="text-center py-4 text-gray-600">
      <Link 
        href="https://khalilkhalef.com" 
        className="group inline-flex items-center gap-3 hover:text-blue-700 transition-colors"
      >
        <span>Made by</span>
        <span className={`${bangers.className} text-purple-600 text-lg sm:text-xl underline decoration-2 underline-offset-2 group-hover:text-purple-700`}>
          Khalil Khalef
        </span>
        <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-purple-500 group-hover:border-purple-700 transition-colors">
          <Image
            src="/assets/images/khalil.jpeg"
            alt="Khalil Khalef"
            fill
            className="object-cover"
          />
        </div>
      </Link>
    </footer>
  )
} 