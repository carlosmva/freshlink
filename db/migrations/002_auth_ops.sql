-- Auth, fleet, and JSON payloads that the mockup served statically.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS meta JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('facility', 'food', 'transport')),
  facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT users_tenant_chk CHECK (
    (role = 'facility' AND facility_id IS NOT NULL AND partner_id IS NULL)
    OR (role IN ('food', 'transport') AND partner_id IS NOT NULL AND facility_id IS NULL)
  )
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  temp_zones TEXT,
  capacity_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  battery_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  assigned_route TEXT,
  mileage INT NOT NULL DEFAULT 0
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  status TEXT NOT NULL,
  vehicle TEXT,
  route TEXT,
  stops_done INT NOT NULL DEFAULT 0,
  stops_total INT NOT NULL DEFAULT 0,
  on_time_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  phone TEXT
);

CREATE TABLE partner_payouts (
  partner_id UUID PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  payload JSONB NOT NULL
);

CREATE TABLE demand_forecasts (
  partner_id UUID PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  payload JSONB NOT NULL
);

CREATE TABLE partner_earnings (
  partner_id UUID PRIMARY KEY REFERENCES partners(id) ON DELETE CASCADE,
  payload JSONB NOT NULL
);

CREATE INDEX idx_users_email_lower ON users (lower(email));
CREATE INDEX idx_vehicles_partner ON vehicles(partner_id);
CREATE INDEX idx_drivers_partner ON drivers(partner_id);
