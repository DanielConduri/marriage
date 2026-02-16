"use client"

import { useState } from "react"

export function RsvpSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="rsvp" className="bg-card py-20 md:py-28">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Be part of our day
        </p>
        <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">
          RSVP
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Kindly respond by August 1, 2026. We would be honored to celebrate
          this special day with you.
        </p>

        {submitted ? (
          <div className="mt-10 border border-border bg-background px-8 py-10">
            <h3 className="font-serif text-2xl text-foreground">Thank You</h3>
            <p className="mt-3 text-muted-foreground">
              {"We've received your RSVP and can't wait to celebrate with you!"}
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
                  First Name
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
                  htmlFor="lastName"
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="attendance"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Attendance
              </label>
              <select
                id="attendance"
                name="attendance"
                required
                className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="">Select an option</option>
                <option value="attending">Joyfully Accepts</option>
                <option value="not-attending">Respectfully Declines</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="guests"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Number of Guests
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
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                Message (optional)
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
              className="mt-2 border border-foreground bg-foreground px-8 py-3 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              Send RSVP
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
