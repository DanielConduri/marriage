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

  const sslFromEnv = process.env.DATABASE_SSL
  const hasSslModeRequire = /[?&]sslmode=require/i.test(connectionString)
  const enableSsl = sslFromEnv === "true" || hasSslModeRequire

  return new Pool({
    connectionString,
    ssl: enableSsl ? { rejectUnauthorized: false } : false,
  })
}

export function getPool() {
  if (!globalWithPool.postgresPool) {
    globalWithPool.postgresPool = createPool()
  }

  return globalWithPool.postgresPool
}