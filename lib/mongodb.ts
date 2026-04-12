import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable")
  }
  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo.mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalForMongo.mongoClientPromise = client.connect()
    }
    return globalForMongo.mongoClientPromise
  }
  if (!clientPromise) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
  return clientPromise
}

export async function getDb() {
  const c = await getClientPromise()
  const name = process.env.MONGODB_DB || "impiclabs_invoice"
  return c.db(name)
}
