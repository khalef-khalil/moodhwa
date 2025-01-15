import { Bangers } from 'next/font/google'
import { redirect } from 'next/navigation'

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
})

interface MoodButtonProps {
  text: string
  emoji: string
}

async function handleMoodSelect(formData: FormData) {
  'use server'
  const mood = formData.get('mood') as string
  const moodLower = mood.toLowerCase()
  redirect(`/manhwas/${encodeURIComponent(moodLower)}`)
}

export default function MoodButton({ text, emoji }: MoodButtonProps) {
  return (
    <form action={handleMoodSelect}>
      <button
        type="submit"
        className="w-full h-full bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center justify-center gap-1 p-2"
      >
        <span className="text-xl sm:text-2xl md:text-3xl">{emoji}</span>
        <span className={`text-xs sm:text-sm md:text-base text-gray-700 ${bangers.className}`}>
          {text}
        </span>
      </button>
      <input type="hidden" name="mood" value={text} />
    </form>
  )
} 