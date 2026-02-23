import { Pool } from "pg"

type GlobalWithPool = typeof globalThis & {
  postgresPool?: Pool
}

const globalWithPool = globalThis as GlobalWithPool

function createPool() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada")
  }

  return new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })
}

export function getPool() {
  if (!globalWithPool.postgresPool) {
    globalWithPool.postgresPool = createPool()
  }

  return globalWithPool.postgresPool
}