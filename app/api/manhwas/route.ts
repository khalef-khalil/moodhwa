import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mood = searchParams.get('mood')

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood parameter is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    
    if (!db) {
      throw new Error('Database connection failed')
    }
    
    const manhwas = await db.collection('Manhwas')
      .find({ 
        moods: { 
          $regex: new RegExp(mood, 'i')
        } 
      })
      .toArray()

    if (manhwas.length === 0) {
      return NextResponse.json(
        { error: 'No manhwas found for this mood' },
        { status: 404 }
      )
    }

    // Sort manhwas by rating (highest to lowest)
    const sortedManhwas = manhwas.sort((a, b) => b.rating - a.rating)

    return NextResponse.json(sortedManhwas)
  } catch (error) {
    console.error('Error in manhwas API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch manhwas' },
      { status: 500 }
    )
  }
} 