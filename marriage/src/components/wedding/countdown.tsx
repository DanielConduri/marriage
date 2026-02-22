"use client"

import { useEffect, useState } from "react"

const TARGET_DATE = new Date("2026-03-15T09:00:00")

function calcTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown() {
  const [time, setTime] = useState(calcTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: "Días", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Minutos", value: time.minutes },
    { label: "Segundos", value: time.seconds },
  ]

  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Contando los días para nuestro día especial
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <span className="font-serif text-5xl text-foreground md:text-6xl">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
