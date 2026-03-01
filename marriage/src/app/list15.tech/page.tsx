"use client"

import { useEffect, useState } from "react"

type RsvpRow = {
  id: number
  first_name: string
  cedula: string
  guests: number
  message: string | null
  created_at: string
}

type ApiResult = {
  data?: RsvpRow[]
  message?: string
}

export default function ListPage() {
  const [cedula, setCedula] = useState("")
  const [rows, setRows] = useState<RsvpRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)

        const query = cedula ? `?cedula=${encodeURIComponent(cedula)}` : ""
        const response = await fetch(`/api/rsvp${query}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        })

        const result = (await response.json().catch(() => null)) as ApiResult | null

        if (!response.ok) {
          setRows([])
          setError(result?.message ?? "No se pudo obtener la lista")
          return
        }

        setRows(result?.data ?? [])
      } catch {
        setRows([])
        setError("No se pudo obtener la lista")
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [cedula])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Listado de invitados</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Escribe la <strong>cédula</strong> y el listado se filtra automáticamente.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          name="cedula"
          value={cedula}
          onChange={(event) => {
            const onlyDigits = event.target.value.replace(/\D/g, "").slice(0, 10)
            setCedula(onlyDigits)
          }}
          placeholder="Buscar por cédula"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-muted-foreground">Buscando coincidencias...</p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Cédula</th>
              <th className="px-4 py-3 text-left">Invitados</th>
              <th className="px-4 py-3 text-left">Mensaje</th>
              <th className="px-4 py-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-muted-foreground" colSpan={6}>
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.first_name}</td>
                  <td className="px-4 py-3">{row.cedula}</td>
                  <td className="px-4 py-3">{row.guests}</td>
                  <td className="px-4 py-3">{row.message ?? "-"}</td>
                  <td className="px-4 py-3">
                    {new Date(row.created_at).toLocaleString("es-EC")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
