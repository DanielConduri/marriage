import { NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export const runtime = "nodejs"

type RsvpPayload = {
  firstName?: string
  cedula?: string
  guests?: number
  message?: string
}

type DbErrorLike = {
  code?: string
  message?: string
  detail?: string
  name?: string
}

function validarCedulaEcuador(cedula: string) {
  if (!/^\d{10}$/.test(cedula)) return false

  const provincia = Number.parseInt(cedula.substring(0, 2), 10)
  const tercerDigito = Number.parseInt(cedula[2], 10)

  if (provincia < 1 || provincia > 24) return false
  if (tercerDigito >= 6) return false

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  const digitos = cedula.split("").map(Number)

  let suma = 0
  for (let index = 0; index < 9; index++) {
    let resultado = digitos[index] * coeficientes[index]
    if (resultado > 9) resultado -= 9
    suma += resultado
  }

  const digitoVerificador = (10 - (suma % 10)) % 10

  return digitoVerificador === digitos[9]
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RsvpPayload
    const firstName = body.firstName?.trim()
    const cedula = body.cedula?.trim()
    const guests = Number(body.guests)
    const message = body.message?.trim() || null

    if (!firstName || !cedula) {
      return NextResponse.json(
        { message: "Nombre y cédula son obligatorios" },
        { status: 400 }
      )
    }

    if (!validarCedulaEcuador(cedula)) {
      return NextResponse.json(
        { message: "La cédula ingresada no es válida" },
        { status: 400 }
      )
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 7) {
      return NextResponse.json(
        { message: "Número de invitados inválido" },
        { status: 400 }
      )
    }

    const pool = getPool()

    const existing = await pool.query(
      "SELECT id FROM rsvp_responses WHERE cedula = $1 LIMIT 1",
      [cedula]
    )

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { message: "Este usuario ya registró su asistencia" },
        { status: 409 }
      )
    }

    await pool.query(
      `INSERT INTO rsvp_responses (first_name, cedula, guests, message)
       VALUES ($1, $2, $3, $4)`,
      [firstName, cedula, guests, message]
    )

    return NextResponse.json(
      { message: "Asistencia registrada con éxito" },
      { status: 201 }
    )
  } catch (error: unknown) {
    const err = (error ?? {}) as DbErrorLike
    const code = err.code

    console.error("RSVP API error", {
      code,
      name: err.name,
      message: err.message,
      detail: err.detail,
    })

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { message: "Este usuario ya registró su asistencia" },
        { status: 409 }
      )
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENV_MISSING"
    ) {
      return NextResponse.json(
        {
          message:
            "Falta configurar la conexión de base de datos en el servidor (DATABASE_URL).",
          errorCode: "ENV_MISSING",
        },
        { status: 500 }
      )
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "28P01"
    ) {
      return NextResponse.json(
        { message: "Error de autenticación a la base de datos. Revisa DATABASE_URL.", errorCode: "28P01" },
        { status: 500 }
      )
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "3D000"
    ) {
      return NextResponse.json(
        { message: "La base de datos configurada no existe.", errorCode: "3D000" },
        { status: 500 }
      )
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "42P01"
    ) {
      return NextResponse.json(
        { message: "La tabla rsvp_responses no existe en la base de datos.", errorCode: "42P01" },
        { status: 500 }
      )
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.code === "ETIMEDOUT")
    ) {
      return NextResponse.json(
        { message: "No se pudo conectar a PostgreSQL. Verifica host, puerto y acceso de red.", errorCode: error.code },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "No se pudo registrar la asistencia", errorCode: code || "UNKNOWN" },
      { status: 500 }
    )
  }
}