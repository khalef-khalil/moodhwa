import { MongoClient, ServerApiVersion, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
console.log('MongoDB URI:', uri.replace(/:[^:@]+@/, ':****@')) // Log URI without password

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient>

async function connectToDatabase(): Promise<MongoClient> {
  try {
    if (!client) {
      console.log('Creating new MongoDB client...')
      client = new MongoClient(uri, options)
      console.log('Attempting to connect to MongoDB...')
      
      try {
        // Test the connection
        await client.connect()
        console.log('Initial connection successful, testing with ping...')
        
        await client.db('admin').command({ ping: 1 })
        console.log('Ping successful, connection fully verified.')
        
        // Test access to the actual database
        const testDb = client.db(process.env.MONGODB_DB)
        await testDb.command({ ping: 1 })
        console.log(`Successfully connected to database: ${process.env.MONGODB_DB}`)
      } catch (connError) {
        console.error('Connection test failed:', connError)
        if (client) {
          console.log('Closing failed connection...')
          await client.close()
          client = undefined
        }
        throw connError
      }
    }
    return client
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectToDatabase()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = connectToDatabase()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise 