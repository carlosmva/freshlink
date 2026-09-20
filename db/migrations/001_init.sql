-- FreshLink Detroit schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  resident_count INT NOT NULL DEFAULT 0,
  weekly_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  diet_tags TEXT[] NOT NULL DEFAULT '{}',
  contact_initials TEXT NOT NULL DEFAULT 'FL'
);

CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  partner_type TEXT NOT NULL CHECK (partner_type IN ('food', 'transport')),
  contact_name TEXT,
  contact_role TEXT
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  category TEXT,
  emoji TEXT DEFAULT '📦',
  tags TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'warn', 'low')),
  UNIQUE (partner_id, product_id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  week_of DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'approved', 'fulfilled', 'cancelled')),
  food_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_savings NUMERIC(12,2) NOT NULL DEFAULT 0,
  baseline_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  partner_id UUID REFERENCES partners(id),
  quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  source_tag TEXT,
  is_surplus BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  original_product_id UUID REFERENCES products(id),
  suggested_product_id UUID REFERENCES products(id),
  reason TEXT,
  savings NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  window_label TEXT,
  status TEXT NOT NULL DEFAULT 'offered'
    CHECK (status IN ('offered', 'accepted', 'in_progress', 'completed')),
  capacity_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  miles_saved NUMERIC(8,2) NOT NULL DEFAULT 0,
  is_ev BOOLEAN NOT NULL DEFAULT true,
  temp_c NUMERIC(5,2),
  earnings NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id),
  stop_order INT NOT NULL,
  label TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'en_route', 'delivered', 'skipped')),
  pod_at TIMESTAMPTZ
);

CREATE TABLE impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  month_label TEXT NOT NULL,
  meals_supported INT NOT NULL DEFAULT 0,
  dollars_saved NUMERIC(12,2) NOT NULL DEFAULT 0,
  local_spend_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  surplus_lb NUMERIC(10,2) NOT NULL DEFAULT 0,
  on_time_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  deliveries_on_time INT NOT NULL DEFAULT 0,
  deliveries_total INT NOT NULL DEFAULT 0,
  fill_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  monthly_savings JSONB NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE (facility_id, month_label)
);

CREATE INDEX idx_orders_facility ON orders(facility_id);
CREATE INDEX idx_inventory_partner ON inventory(partner_id);
CREATE INDEX idx_routes_partner ON routes(partner_id);
CREATE INDEX idx_route_stops_route ON route_stops(route_id);
