import { Metadata } from 'next'

interface Props {
  params: { mood: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedMood = decodeURIComponent(params.mood)
  
  return {
    title: `${decodedMood} Manhwas`,
    description: `Discover the best manhwas that match your ${decodedMood.toLowerCase()} mood. Find top-rated recommendations curated just for you.`,
    openGraph: {
      title: `${decodedMood} Manhwas | Moodhwa`,
      description: `Find the perfect manhwa for when you're feeling ${decodedMood.toLowerCase()}`,
    },
  }
}

export default function MoodLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 