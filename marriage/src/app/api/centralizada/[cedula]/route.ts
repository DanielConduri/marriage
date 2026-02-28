import { NextResponse } from "next/server"

type Params = {
  params: {
    cedula: string
  }
}

export async function GET(_: Request, { params }: Params) {
  const cedula = params.cedula?.trim()
    console.log('Received cedula:', cedula)
  if (!cedula) {
    return NextResponse.json({ message: "Cédula requerida" }, { status: 400 })
  }

  const upstreamUrl = `https://store.pruebasinventario.com/apiv3/centralizada/${encodeURIComponent(cedula)}`
  
  try {
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      cache: "no-store",
    })

    console.log('Fetching from upstream URL:', upstream)
    const data = await upstream.json().catch(() => null)
    console.log('Upstream response data:', data)
    if (!upstream.ok) {
      return NextResponse.json(
        { message: "Error consultando API externa", status: upstream.status, data },
        { status: upstream.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: "No se pudo conectar con la API externa" },
      { status: 502 }
    )
  }
}
