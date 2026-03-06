"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

type ProvinceMeta = {
  province: string
  city: string
}

type LocationCount = {
  name: string
  count: number
}

type GuestCount = {
  guests: string
  count: number
}

const PROVINCES_BY_CODE: Record<string, ProvinceMeta> = {
  "01": { province: "Azuay", city: "Cuenca" },
  "02": { province: "Bolivar", city: "Guaranda" },
  "03": { province: "Canar", city: "Azogues" },
  "04": { province: "Carchi", city: "Tulcan" },
  "05": { province: "Cotopaxi", city: "Latacunga" },
  "06": { province: "Chimborazo", city: "Riobamba" },
  "07": { province: "El Oro", city: "Machala" },
  "08": { province: "Esmeraldas", city: "Esmeraldas" },
  "09": { province: "Guayas", city: "Guayaquil" },
  "10": { province: "Imbabura", city: "Ibarra" },
  "11": { province: "Loja", city: "Loja" },
  "12": { province: "Los Rios", city: "Babahoyo" },
  "13": { province: "Manabi", city: "Portoviejo" },
  "14": { province: "Morona Santiago", city: "Macas" },
  "15": { province: "Napo", city: "Tena" },
  "16": { province: "Pastaza", city: "Puyo" },
  "17": { province: "Pichincha", city: "Quito" },
  "18": { province: "Tungurahua", city: "Ambato" },
  "19": { province: "Zamora Chinchipe", city: "Zamora" },
  "20": { province: "Galapagos", city: "Puerto Baquerizo Moreno" },
  "21": { province: "Sucumbios", city: "Nueva Loja" },
  "22": { province: "Orellana", city: "Puerto Francisco de Orellana" },
  "23": { province: "Santo Domingo de los Tsachilas", city: "Santo Domingo" },
  "24": { province: "Santa Elena", city: "Santa Elena" },
}

const CHART_COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
  "#84cc16",
  "#8b5cf6",
]

function getProvinceCode(cedula: string) {
  if (!/^\d{10}$/.test(cedula)) {
    return null
  }

  return cedula.slice(0, 2)
}

function sortByCountDesc(a: LocationCount, b: LocationCount) {
  return b.count - a.count
}

export default function ListPage() {
  const [cedula, setCedula] = useState("")
  const [rows, setRows] = useState<RsvpRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dashboard = useMemo(() => {
    const totalUsers = rows.length
    const totalGuests = rows.reduce((accumulator, row) => accumulator + row.guests, 0)

    const provinceCounter = new Map<string, number>()
    const cityCounter = new Map<string, number>()
    let validCedulas = 0

    for (const row of rows) {
      const provinceCode = getProvinceCode(row.cedula)
      if (!provinceCode) {
        continue
      }

      const provinceMeta = PROVINCES_BY_CODE[provinceCode]
      if (!provinceMeta) {
        continue
      }

      validCedulas += 1
      provinceCounter.set(
        provinceMeta.province,
        (provinceCounter.get(provinceMeta.province) ?? 0) + 1
      )
      cityCounter.set(
        provinceMeta.city,
        (cityCounter.get(provinceMeta.city) ?? 0) + 1
      )
    }

    const provincesData = Array.from(provinceCounter.entries())
      .map(([name, count]) => ({ name, count }))
      .sort(sortByCountDesc)

    const rawCityData = Array.from(cityCounter.entries())
      .map(([name, count]) => ({ name, count }))
      .sort(sortByCountDesc)

    const cityData =
      rawCityData.length <= 8
        ? rawCityData
        : [
            ...rawCityData.slice(0, 7),
            {
              name: "Otros",
              count: rawCityData.slice(7).reduce((accumulator, item) => accumulator + item.count, 0),
            },
          ]

    const guestsData: GuestCount[] = Array.from({ length: 7 }, (_, index) => {
      const guestsNumber = index + 1
      return {
        guests: String(guestsNumber),
        count: rows.filter((row) => row.guests === guestsNumber).length,
      }
    })

    return {
      totalUsers,
      totalGuests,
      validCedulas,
      invalidCedulas: totalUsers - validCedulas,
      provincesData,
      cityData,
      guestsData,
    }
  }, [rows])

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
      <h1 className="text-2xl font-semibold">Reporte de invitados</h1>
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total registrados</CardDescription>
            <CardTitle className="text-3xl">{dashboard.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Usuarios con RSVP registrado.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total invitados</CardDescription>
            <CardTitle className="text-3xl">{dashboard.totalGuests}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Suma del campo invitados.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ciudades detectadas</CardDescription>
            <CardTitle className="text-3xl">{dashboard.cityData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ciudades referenciales por cédula.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cédulas válidas</CardDescription>
            <CardTitle className="text-3xl">{dashboard.validCedulas}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Inválidas/no mapeadas: {dashboard.invalidCedulas}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Registros por provincia</CardTitle>
            <CardDescription>Cédulas agrupadas por código provincial (01-24).</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.provincesData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay información geográfica disponible.</p>
            ) : (
              <ChartContainer
                className="h-[320px] w-full"
                config={{
                  count: {
                    label: "Registros",
                    color: "#0ea5e9",
                  },
                }}
              >
                <BarChart data={dashboard.provincesData} layout="vertical" margin={{ left: 18, right: 18 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="var(--color-count)" />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por ciudad</CardTitle>
            <CardDescription>Ciudad referencial según provincia de la cédula.</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.cityData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay datos para el gráfico de pastel.</p>
            ) : (
              <ChartContainer
                className="h-[320px] w-full"
                config={dashboard.cityData.reduce<Record<string, { label: string; color: string }>>(
                  (accumulator, item, index) => {
                    accumulator[item.name] = {
                      label: item.name,
                      color: CHART_COLORS[index % CHART_COLORS.length],
                    }
                    return accumulator
                  },
                  {}
                )}
              >
                <PieChart>
                  <Pie
                    data={dashboard.cityData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={108}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {dashboard.cityData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invitados por registro</CardTitle>
            <CardDescription>Cantidad de respuestas para cada valor de invitados (1 a 7).</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[280px] w-full"
              config={{
                count: {
                  label: "Respuestas",
                  color: "#22c55e",
                },
              }}
            >
              <BarChart data={dashboard.guestsData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="guests" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Nota: la ciudad mostrada es referencial (capital provincial) y se infiere desde los dos
        primeros dígitos de la cédula.
      </p>

      {isLoading && (
        <p className="mt-4 text-sm text-muted-foreground">Buscando coincidencias...</p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

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
      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
               <th className="px-4 py-3 text-left">#</th>
              {/* <th className="px-4 py-3 text-left">ID</th> */}
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
              rows.map((row, index) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3">{index +1}</td>
                  {/* <td className="px-4 py-3">{row.id}</td> */}
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
