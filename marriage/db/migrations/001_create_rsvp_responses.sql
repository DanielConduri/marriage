CREATE TABLE IF NOT EXISTS rsvp_responses (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(120) NOT NULL,
  cedula VARCHAR(10) NOT NULL UNIQUE,
  guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 7),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_responses_cedula
  ON rsvp_responses (cedula);
