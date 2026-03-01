"use client"

import { useState } from "react"

export function RsvpSection() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [cedulaError, setCedulaError] = useState("")
  const [submitError, setSubmitError] = useState("")

  function validarCedulaEcuador(cedula: string) {
  if (!/^\d{10}$/.test(cedula)) return false

  const provincia = parseInt(cedula.substring(0, 2), 10)
  const tercerDigito = parseInt(cedula[2], 10)

  if (provincia < 1 || provincia > 24) return false
  if (tercerDigito >= 6) return false

  const coeficientes = [2,1,2,1,2,1,2,1,2]
  const digitos = cedula.split("").map(Number)

  let suma = 0
  for (let i = 0; i < 9; i++) {
    let resultado = digitos[i] * coeficientes[i]
    if (resultado > 9) resultado -= 9
    suma += resultado
  }

  const digitoVerificador = (10 - (suma % 10)) % 10

  return digitoVerificador === digitos[9]
}

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError("")

    const formData = new FormData(e.currentTarget)
    const firstName = (formData.get("firstName") as string)?.trim()
    const cedula = (formData.get("cedula") as string)?.trim()
    const guests = Number(formData.get("guests"))
    const message = ((formData.get("message") as string) || "").trim()

    if (!validarCedulaEcuador(cedula)) {
      setCedulaError("La cédula ingresada no es válida")
      return
    }

    setCedulaError("")

    try {
      setIsSubmitting(true)
      const test = await fetch(`/api/user/${encodeURIComponent(cedula)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('Test API response:', await test.json().catch(() => null))

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          cedula,
          guests,
          message,
        }),
      })

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null
      console.log('RSVP response:', { status: response.status, body: result })
      if (!response.ok) {
        const errorMessage = result?.message || "No se pudo registrar la asistencia"

        if (response.status === 409) {
          setCedulaError(errorMessage)
        } else {
          setSubmitError(errorMessage)
        }

        return


      // try {
      //   const test = await fetch(`/api/user/${encodeURIComponent(cedula)}`, {
      //     method: "GET",
      //   })
      //   console.log('Test API response:', await test.json().catch(() => null))
      // } catch (error) {
      //   console.warn('Test API request failed:', error)
      // }


      // const response = await fetch(`/api/user/${encodeURIComponent(cedula)}`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //     firstName,
      //     cedula,
      //     guests,
      //     message,
      //   }),
      // })


      // const result = (await response.json().catch(() => null)) as
      //   | { message?: string }
      //   | null
      // console.log('RSVP response:', { status: response.status, body: result })
      // if (!response.ok) {
      //   const duplicateMessage = "Este usuario ya registró su asistencia"
      //   const isAlreadyRegistered = /ya\s+se\s+encuentra\s+registrado|ya\s+registró\s+su\s+asistencia/i.test(result?.message ?? "")
      //   const errorMessage = isAlreadyRegistered
      //     ? duplicateMessage
      //     : (result?.message || "No se pudo registrar la asistencia")

      //   if (response.status === 409) {
      //     setCedulaError(errorMessage)
      //   } else {
      //     setSubmitError(errorMessage)
      //   }

      //   return
      }

      setSubmitted(true)
      e.currentTarget.reset()
    } catch {
      setSubmitError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  return (
    <section id="rsvp" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Sé parte de nuestro día
        </p>
        <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
          ASISTENCIA
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Por favor responda antes del 5 de marzo de 2026. Sería un honor para nosotros celebrar este día especial con usted.
        </p>

        {submitted ? (
          <div className="mt-10 border border-border bg-background px-8 py-10">
            <h3 className="font-serif text-2xl text-foreground">Gracias</h3>
            <p className="mt-3 text-muted-foreground">
              {"Hemos recibido su confirmación y ¡no podemos esperar para celebrar con usted!"}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-5 text-left"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="firstName"
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                >
                  Nombre y apellido
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cedula"
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                >
                  Cédula
                </label>
                <input
                  id="cedula"
                  name="cedula"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    if (cedulaError) setCedulaError("")
                  }}
                  className={`border px-4 py-3 text-sm outline-none transition-colors ${
                    cedulaError
                      ? "border-red-500 bg-red-50"
                      : "border-border bg-background focus:border-accent"
                  }`}
                />

                {cedulaError && (
                <span className="text-xs text-red-500">
                  {cedulaError}
                </span>
              )}
              </div>
            </div>

            {/* <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </div> */}

            {/* <div className="flex flex-col gap-1.5">
              <label
                htmlFor="attendance"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Asistencia
              </label>
              <select
                id="attendance"
                name="attendance"
                required
                className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="">Seleccione una opción</option>
                <option value="attending">Asistirá con alegría</option>
                <option value="not-attending">Declina respetuosamente</option>
              </select>
            </div> */}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guests"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Número de invitados
              </label>
              <select
                id="guests"
                name="guests"
                className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Mensaje (opcional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 border border-foreground bg-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>

            {submitError && (
              <p className="text-sm text-red-500">
                {submitError}
              </p>
            )}

          </form>
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          
        </p>
        {/* <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
          ASISTENCIA
        </h2> */}
       <div className="mx-auto mt-10 max-w-3xl space-y-6 text-center">
          <div className="space-y-2">
            {/* <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Regalos</p> */}
            <h3 className="font-serif text-2xl text-foreground md:text-3xl">Nuestro nuevo comienzo</h3>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">
            Sabemos que no siempre es posible estar presentes físicamente,
            pero agradecemos de corazón tu cariño y buenos deseos. <br />
            Si deseas contribuir con nuestro nuevo comienzo, puedes hacerlo aquí:
          </p>

          <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm backdrop-blur-sm md:p-6">
            <div className="grid items-stretch gap-4 md:grid-cols-2 md:gap-6">
              <div className="flex h-full flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-6 text-left shadow-md transition-transform duration-300 hover:-translate-y-0.5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cuenta de ahorros</p>
                  <p className="text-xl font-semibold text-foreground">Banco Pichincha</p>
                </div>

                <div className="space-y-2 text-sm text-foreground/90">
                  <p><span className="font-medium">Nombre:</span> Daniel Tene</p>
                  <p><span className="font-medium">Cuenta:</span> 2204705173</p>
                  <p><span className="font-medium">CI:</span> 1725142705</p>
                </div>
              </div>

              <div className="flex h-full flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-6 text-left shadow-md transition-transform duration-300 hover:-translate-y-0.5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Cuenta de ahorros</p>
                  <p className="text-xl font-semibold text-foreground">Banco Pichincha</p>
                </div>

                <div className="space-y-2 text-sm text-foreground/90">
                  <p><span className="font-medium">Nombre:</span> Nelly Hipo</p>
                  <p><span className="font-medium">Cuenta:</span> 2214249905</p>
                  <p><span className="font-medium">CI:</span> 0650173354</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
