import { NextResponse } from "next/server"
export const runtime = "nodejs"

type Params = {
  params: {
    cedula: string
  }
}

export async function GET(_: Request, { params }: Params) {
  const cedula = params.cedula?.trim()

  if (!cedula) {
    return NextResponse.json({ message: "Cédula requerida" }, { status: 400 })
  }

  const apiBaseUrl = (process.env.BACKEND_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "")
  const upstreamUrl = `${apiBaseUrl}/apiv3/users/${encodeURIComponent(cedula)}`

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      cache: "no-store",
    })

    const contentType = upstream.headers.get("content-type") ?? ""
    const data = contentType.includes("application/json")
      ? await upstream.json().catch(() => null)
      : await upstream.text().catch(() => null)

    return NextResponse.json(data, { status: upstream.status })
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el backend de usuarios" },
      { status: 502 }
    )
  }
}

export async function POST(request: Request, { params }: Params) {
  const cedula = params.cedula?.trim()

  if (!cedula) {
    return NextResponse.json({ message: "Cédula requerida" }, { status: 400 })
  }
  let baseUrl  = process.env.NODE_ENV === "development" 
    ? "http://localhost:8000"
    : process.env.BACKEND_API_BASE_URL ?? "https://store.pruebasinventario.com"
  
  console.log('baseUrl', baseUrl)
  console.log('Original BACKEND_API_BASE_URL:', baseUrl)
  const apiBaseUrl = (process.env.BACKEND_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "")
  const upstreamUrl = `${apiBaseUrl}/apiv3/users`
  console.log('upstreamUrl:', upstreamUrl)
  let payload: unknown = null

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Body JSON inválido" }, { status: 400 })
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const contentType = upstream.headers.get("content-type") ?? ""
    const data = contentType.includes("application/json")
      ? await upstream.json().catch(() => null)
      : await upstream.text().catch(() => null)

    if (data && typeof data === "object") {
      const parsed = data as {
        status?: boolean
        message?: string
        body?: {
          status?: boolean
          message?: string
        }
      }

      const rootFailed = parsed.status === false
      const nestedFailed = parsed.body?.status === false

      if (rootFailed || nestedFailed) {
        const upstreamMessage = parsed.body?.message || parsed.message || "No se pudo procesar el usuario"
        const isAlreadyRegistered = /ya\s+se\s+encuentra\s+registrado/i.test(upstreamMessage)
        const message = isAlreadyRegistered
          ? "Este usuario ya registró su asistencia"
          : upstreamMessage

        return NextResponse.json(
          { message, data: parsed },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(data, { status: upstream.status })
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con el backend de usuarios" },
      { status: 502 }
    )
  }
}

