import { Pool } from "pg"

type GlobalWithPool = typeof globalThis & {
  postgresPool?: Pool
}

const globalWithPool = globalThis as GlobalWithPool

function createPool() {
  const connectionString =
    process.env.DATABASE_URL ?? process.env.DATABASE_URL_NOT_REQUIRE

  if (!connectionString) {
    const error = new Error(
      "DATABASE_URL no está configurada (ni DATABASE_URL_NOT_REQUIRE)"
    ) as Error & { code?: string }

    error.code = "ENV_MISSING"
    throw error
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