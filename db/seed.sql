-- Pilot scenario seed (Hope Harbor / Core Supply / GreenRoute)

INSERT INTO facilities (id, name, slug, resident_count, weekly_budget, diet_tags, contact_initials)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Hope Harbor Shelter', 'hope-harbor', 75, 2400.00,
   ARRAY['Low-sodium','Diabetes-conscious','Easy-chew','Culturally responsive'], 'DM'),
  ('11111111-1111-1111-1111-111111111112', 'Riverfront Senior Home', 'riverfront-senior', 48, 1800.00,
   ARRAY['Low-sodium','Easy-chew'], 'RS'),
  ('11111111-1111-1111-1111-111111111113', 'Eastside Group Home', 'eastside-group', 22, 900.00,
   ARRAY['Diabetes-conscious'], 'EG'),
  ('11111111-1111-1111-1111-111111111114', 'Corktown Adult Foster', 'corktown-foster', 18, 720.00,
   ARRAY['Diabetes-conscious','Culturally responsive'], 'CA'),
  ('11111111-1111-1111-1111-111111111115', 'Midtown Recovery House', 'midtown-recovery', 32, 1280.00,
   ARRAY['Low-sodium','Culturally responsive'], 'MR'),
  ('11111111-1111-1111-1111-111111111116', 'Southwest Senior Residences', 'southwest-senior', 60, 2100.00,
   ARRAY['Low-sodium','Easy-chew','Diabetes-conscious'], 'SS');

INSERT INTO partners (id, name, slug, partner_type, contact_name, contact_role) VALUES
  ('22222222-2222-2222-2222-222222222221', 'Core Supply Co-op', 'core-supply', 'food', 'Aisha Rahman', 'Inventory lead'),
  ('22222222-2222-2222-2222-222222222222', 'Michigan Greens Farm', 'michigan-greens', 'food', 'Tom Nguyen', 'Farm manager'),
  ('22222222-2222-2222-2222-222222222223', 'Detroit Grocery Partner', 'detroit-grocery', 'food', 'Priya Shah', 'Surplus coordinator'),
  ('22222222-2222-2222-2222-222222222224', 'GreenRoute Logistics', 'greenroute', 'transport', 'Marcus Lee', 'Fleet ops');

INSERT INTO products (id, name, unit, category, emoji, tags) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Brown rice · 25 lb', 'bag', 'grains', '🍚', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333302', 'Chicken breast, frozen · 40 lb', 'case', 'protein', '🍗', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333303', 'Spinach, frozen Michigan-grown', 'case', 'produce', '🥬', ARRAY['local','surplus']),
  ('33333333-3333-3333-3333-333333333304', 'Apples, Gala · 3 crates', 'crates', 'produce', '🍎', ARRAY['surplus']),
  ('33333333-3333-3333-3333-333333333305', 'Low-sodium vegetable broth · 6 gal', 'pack', 'pantry', '🥛', ARRAY['grocer']),
  ('33333333-3333-3333-3333-333333333306', 'Eggs · 15 dozen', 'flat', 'protein', '🥚', ARRAY['local']),
  ('33333333-3333-3333-3333-333333333307', 'Fresh mixed greens', 'case', 'produce', '🥗', ARRAY['local']),
  ('33333333-3333-3333-3333-333333333308', 'Whole wheat bread · 24 loaves', 'case', 'bakery', '🍞', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333309', 'Black beans · 20 lb', 'bag', 'pantry', '🫘', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333310', 'Yogurt, plain · 12 qt', 'case', 'dairy', '🫙', ARRAY['grocer']),
  ('33333333-3333-3333-3333-333333333311', 'Whole milk · 20 gal', 'crate', 'dairy', '🥛', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333312', 'Sweet potatoes, Michigan · 40 lb', 'bag', 'produce', '🍠', ARRAY['local']),
  ('33333333-3333-3333-3333-333333333313', 'Rolled oats · 25 lb', 'bag', 'grains', '🥣', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333314', 'Turkey chili, low-sodium · 12 cans', 'case', 'pantry', '🥫', ARRAY['grocer']),
  ('33333333-3333-3333-3333-333333333315', 'Carrots, local · 20 lb', 'bag', 'produce', '🥕', ARRAY['local','surplus']),
  ('33333333-3333-3333-3333-333333333316', 'Cheddar, sliced · 10 lb', 'case', 'dairy', '🧀', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333317', 'Frozen peas · 20 lb', 'case', 'produce', '🟢', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333318', 'Chicken thighs, frozen · 40 lb', 'case', 'protein', '🍗', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333319', 'Corn tortillas · 20 lb', 'case', 'bakery', '🌮', ARRAY['grocer']),
  ('33333333-3333-3333-3333-333333333320', 'Canned peaches, surplus · 12 cans', 'case', 'pantry', '🍑', ARRAY['surplus']),
  ('33333333-3333-3333-3333-333333333321', 'Lentils · 20 lb', 'bag', 'pantry', '🫘', ARRAY['hub']),
  ('33333333-3333-3333-3333-333333333322', 'Baby greens · 14 lb', 'case', 'produce', '🥗', ARRAY['local','surplus']);

INSERT INTO inventory (partner_id, product_id, quantity, unit_price, status) VALUES
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333301', 120, 21.40, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333302', 45, 86.20, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333308', 80, 28.50, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333309', 95, 18.75, 'warn'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333303', 60, 12.80, 'ok'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333306', 40, 41.25, 'ok'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333307', 0, 22.40, 'low'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333304', 25, 18.00, 'ok'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333305', 70, 29.40, 'ok'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333310', 35, 24.00, 'warn'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333311', 90, 38.50, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333313', 110, 16.80, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333316', 55, 42.00, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333317', 70, 19.25, 'ok'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333318', 38, 72.40, 'warn'),
  ('22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333321', 84, 17.10, 'ok'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333312', 48, 22.60, 'ok'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333315', 22, 11.40, 'warn'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333322', 16, 18.90, 'low'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333314', 40, 26.75, 'ok'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333319', 28, 15.50, 'ok'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333320', 12, 14.20, 'warn');

INSERT INTO orders (id, facility_id, week_of, status, food_total, delivery_fee, delivery_savings, baseline_total, meta)
VALUES (
  '44444444-4444-4444-4444-444444444401',
  '11111111-1111-1111-1111-111111111111',
  '2026-09-22',
  'pending_review',
  1986.00,
  65.00,
  40.00,
  2363.20,
  '{"orderRef":"FL-1042","cadence":"Recurring weekly","route":"D-12","window":"Tue, Sep 23 · 9–11 AM","temperature":"Refrigerated · 34–40°F","payment":"Net-7 via FreshLink","icon":"🏠","itemPreview":"Chicken breast, frozen · 40 lb\nWhole milk · 20 gal\nBaby greens · 14 lb\nRolled oats · 2 bags …"}'::jsonb
);

INSERT INTO order_items (order_id, product_id, partner_id, quantity, unit_price, line_total, source_tag, is_surplus) VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222221', 1, 21.40, 21.40, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222221', 1, 86.20, 86.20, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222222', 1, 12.80, 12.80, 'Local', true),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222223', 1, 18.00, 18.00, 'Surplus rescue', true),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222223', 1, 29.40, 29.40, 'Grocery partner', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222222', 1, 41.25, 41.25, 'Local farm', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222221', 2, 28.50, 57.00, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222221', 3, 18.75, 56.25, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222221', 1, 38.50, 38.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222222', 1, 22.60, 22.60, 'Local farm', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333313', '22222222-2222-2222-2222-222222222221', 2, 16.80, 33.60, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333322', '22222222-2222-2222-2222-222222222222', 1, 18.90, 18.90, 'Surplus rescue', true);

INSERT INTO substitutions (id, order_id, original_product_id, suggested_product_id, reason, savings, status) VALUES
  ('55555555-5555-5555-5555-555555555501',
   '44444444-4444-4444-4444-444444444401',
   '33333333-3333-3333-3333-333333333307',
   '33333333-3333-3333-3333-333333333303',
   'Fresh greens unavailable this week. Suggested: frozen Michigan-grown spinach — same nutrition profile, fits freezer capacity, saves $9.60.',
   9.60,
   'pending'),
  ('55555555-5555-5555-5555-555555555502',
   '44444444-4444-4444-4444-444444444401',
   '33333333-3333-3333-3333-333333333310',
   '33333333-3333-3333-3333-333333333310',
   'Prefer plain yogurt case over flavored multipack to stay within sodium guidelines.',
   4.20,
   'pending'),
  ('55555555-5555-5555-5555-555555555503',
   '44444444-4444-4444-4444-444444444401',
   '33333333-3333-3333-3333-333333333302',
   '33333333-3333-3333-3333-333333333318',
   'Chicken breast is tight this week. Suggested: thighs — same protein, easier chew, saves $13.80.',
   13.80,
   'pending');

INSERT INTO routes (id, partner_id, code, delivery_date, window_label, status, capacity_pct, miles_saved, is_ev, temp_c, earnings) VALUES
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222224', 'D-12', '2026-09-23', '9–11 AM', 'accepted', 82, 118, true, 3.2, 245.00),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222224', 'D-14', '2026-09-23', '1–3 PM', 'offered', 76, 64, true, 2.8, 180.00),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222224', 'D-18', '2026-09-23', '3–5 PM', 'offered', 88, 92, true, 3.5, 210.00),
  ('66666666-6666-6666-6666-666666666604', '22222222-2222-2222-2222-222222222224', 'D-11', '2026-09-22', '8–10 AM', 'accepted', 79, 86, true, 3.0, 198.00),
  ('66666666-6666-6666-6666-666666666605', '22222222-2222-2222-2222-222222222224', 'D-13', '2026-09-23', '11 AM–1 PM', 'offered', 84, 74, true, 2.6, 188.00),
  ('66666666-6666-6666-6666-666666666606', '22222222-2222-2222-2222-222222222224', 'D-15', '2026-09-25', '9–11 AM', 'offered', 71, 58, true, 3.1, 164.00),
  ('66666666-6666-6666-6666-666666666607', '22222222-2222-2222-2222-222222222224', 'D-16', '2026-09-18', '2–4 PM', 'completed', 90, 104, true, 3.4, 236.00);

INSERT INTO route_stops (route_id, facility_id, stop_order, label, detail, status) VALUES
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111111', 1, 'Hope Harbor Shelter', 'Bulk cold + dry · dock B', 'delivered'),
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111112', 2, 'Riverfront Senior Home', 'Cold chain required', 'en_route'),
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111113', 3, 'Eastside Group Home', 'Small drop · 8 cases', 'pending'),
  ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111112', 1, 'Riverfront Senior Home', 'Produce-heavy', 'pending'),
  ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111113', 2, 'Eastside Group Home', 'Surplus apples', 'pending'),
  ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111116', 1, 'Southwest Senior Residences', 'Easy-chew protein + produce', 'pending'),
  ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111114', 2, 'Corktown Adult Foster', 'Small dry drop', 'pending'),
  ('66666666-6666-6666-6666-666666666604', '11111111-1111-1111-1111-111111111115', 1, 'Midtown Recovery House', 'Low-sodium pantry', 'delivered'),
  ('66666666-6666-6666-6666-666666666604', '11111111-1111-1111-1111-111111111112', 2, 'Riverfront Senior Home', 'Dairy + bread', 'en_route'),
  ('66666666-6666-6666-6666-666666666605', '11111111-1111-1111-1111-111111111116', 1, 'Southwest Senior Residences', 'Bulk cold', 'pending'),
  ('66666666-6666-6666-6666-666666666605', '11111111-1111-1111-1111-111111111111', 2, 'Hope Harbor Shelter', 'Overflow dry', 'pending'),
  ('66666666-6666-6666-6666-666666666606', '11111111-1111-1111-1111-111111111114', 1, 'Corktown Adult Foster', 'Surplus peaches', 'pending'),
  ('66666666-6666-6666-6666-666666666606', '11111111-1111-1111-1111-111111111115', 2, 'Midtown Recovery House', 'Tortillas + beans', 'pending'),
  ('66666666-6666-6666-6666-666666666607', '11111111-1111-1111-1111-111111111111', 1, 'Hope Harbor Shelter', 'Completed Tuesday run', 'delivered'),
  ('66666666-6666-6666-6666-666666666607', '11111111-1111-1111-1111-111111111113', 2, 'Eastside Group Home', 'Completed Tuesday run', 'delivered');

INSERT INTO impact_metrics (facility_id, month_label, meals_supported, dollars_saved, local_spend_pct, surplus_lb, on_time_pct, deliveries_on_time, deliveries_total, fill_rate_pct, monthly_savings)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'September',
    2310,
    1248.00,
    61,
    480,
    96,
    23,
    24,
    94,
    '[{"m":"Apr","v":32},{"m":"May","v":45},{"m":"Jun","v":52},{"m":"Jul","v":61},{"m":"Aug","v":78},{"m":"Sep","v":100}]'::jsonb
  ),
  (
    '11111111-1111-1111-1111-111111111112',
    'September',
    1488,
    842.00,
    58,
    210,
    97,
    19,
    20,
    93,
    '[{"m":"Apr","v":28},{"m":"May","v":36},{"m":"Jun","v":44},{"m":"Jul","v":55},{"m":"Aug","v":70},{"m":"Sep","v":100}]'::jsonb
  ),
  (
    '11111111-1111-1111-1111-111111111116',
    'September',
    1860,
    1012.00,
    64,
    356,
    95,
    21,
    22,
    92,
    '[{"m":"Apr","v":30},{"m":"May","v":41},{"m":"Jun","v":49},{"m":"Jul","v":58},{"m":"Aug","v":74},{"m":"Sep","v":100}]'::jsonb
  );

-- Invite-only pilot logins. Password for all four: Pilot2026!
INSERT INTO users (id, email, password_hash, name, role, facility_id, partner_id, status) VALUES
  ('77777777-7777-7777-7777-777777777701', 'dana@hopeharbor.org',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Dana Morris', 'facility', '11111111-1111-1111-1111-111111111111', NULL, 'active'),
  ('77777777-7777-7777-7777-777777777702', 'aisha@coresupply.org',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Aisha Rahman', 'food', NULL, '22222222-2222-2222-2222-222222222221', 'active'),
  ('77777777-7777-7777-7777-777777777703', 'marcus@greenroute.org',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Marcus Lee', 'transport', NULL, '22222222-2222-2222-2222-222222222224', 'active'),
  ('77777777-7777-7777-7777-777777777704', 'carlos@northeasternsoftware.com',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Carlos Martinez', 'admin', NULL, NULL, 'active');

INSERT INTO vehicles (id, partner_id, code, type, status, temp_zones, capacity_pct, battery_pct, assigned_route, mileage) VALUES
  ('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222224', 'EV-02', 'Cargo van', 'available', 'Refrigerated', 0, 94, NULL, 18240),
  ('88888888-8888-8888-8888-888888888802', '22222222-2222-2222-2222-222222222224', 'EV-04', 'Cargo van', 'on_route', 'Ambient', 74, 68, 'D-11', 22110),
  ('88888888-8888-8888-8888-888888888803', '22222222-2222-2222-2222-222222222224', 'EV-07', 'Refrigerated van', 'on_route', 'Refrig + ambient', 88, 61, 'D-12', 15480),
  ('88888888-8888-8888-8888-888888888804', '22222222-2222-2222-2222-222222222224', 'EV-09', 'Cargo van', 'charging', 'Ambient', 0, 22, NULL, 9800),
  ('88888888-8888-8888-8888-888888888805', '22222222-2222-2222-2222-222222222224', 'EV-11', 'Refrigerated van', 'maintenance', 'Refrigerated', 0, 100, NULL, 30120),
  ('88888888-8888-8888-8888-888888888806', '22222222-2222-2222-2222-222222222224', 'EV-03', 'Cargo van', 'available', 'Ambient', 0, 88, NULL, 12140),
  ('88888888-8888-8888-8888-888888888807', '22222222-2222-2222-2222-222222222224', 'EV-06', 'Refrigerated van', 'on_route', 'Refrigerated', 81, 54, 'D-13', 17660),
  ('88888888-8888-8888-8888-888888888808', '22222222-2222-2222-2222-222222222224', 'EV-12', 'Cargo van', 'charging', 'Ambient', 0, 36, NULL, 8420);

INSERT INTO drivers (id, partner_id, name, initials, status, vehicle, route, stops_done, stops_total, on_time_pct, phone) VALUES
  ('99999999-9999-9999-9999-999999999901', '22222222-2222-2222-2222-222222222224', 'Marcus T.', 'MT', 'on_route', 'EV-07', 'D-12', 1, 4, 98, 'On shift · Eastside'),
  ('99999999-9999-9999-9999-999999999902', '22222222-2222-2222-2222-222222222224', 'Alicia R.', 'AR', 'on_route', 'EV-04', 'D-11', 2, 3, 96, 'On shift · Midtown'),
  ('99999999-9999-9999-9999-999999999903', '22222222-2222-2222-2222-222222222224', 'Jamal K.', 'JK', 'available', 'EV-02', NULL, 0, 0, 97, 'Standby · Southwest'),
  ('99999999-9999-9999-9999-999999999904', '22222222-2222-2222-2222-222222222224', 'Sofia M.', 'SM', 'off_shift', NULL, NULL, 0, 0, 94, 'Next shift Thu 7 AM'),
  ('99999999-9999-9999-9999-999999999905', '22222222-2222-2222-2222-222222222224', 'Devon P.', 'DP', 'break', NULL, NULL, 0, 0, 99, 'Returns Fri'),
  ('99999999-9999-9999-9999-999999999906', '22222222-2222-2222-2222-222222222224', 'Nina V.', 'NV', 'on_route', 'EV-06', 'D-13', 0, 2, 95, 'On shift · Southwest'),
  ('99999999-9999-9999-9999-999999999907', '22222222-2222-2222-2222-222222222224', 'Chris L.', 'CL', 'available', 'EV-03', NULL, 0, 0, 98, 'Standby · Corktown');

INSERT INTO demand_forecasts (partner_id, payload) VALUES (
  '22222222-2222-2222-2222-222222222221',
  '{"recurringRevenue":12680,"repeatFacilities":18,"avgOrderValue":512,"surplusRecoveredTons":3.4,"demandByCategory":[{"label":"Produce","pct":88,"volume":"2,240 lb"},{"label":"Dairy","pct":71,"volume":"1,560 gal"},{"label":"Protein","pct":63,"volume":"1,420 lb"},{"label":"Pantry","pct":41,"volume":"890 lb"},{"label":"Bakery","pct":36,"volume":"420 lb"}],"weeklyTrend":[34,42,38,52,58,64,78,86,94,100],"aiInsight":"Six clustered kitchens are buying produce and dairy on the same Tuesday. Pull Michigan sweet potatoes and whole milk forward, and offer a volume price that can win Hope Harbor, Riverfront, and Southwest in one cart.","surplusMedianHours":27}'::jsonb
);

INSERT INTO partner_payouts (partner_id, payload) VALUES (
  '22222222-2222-2222-2222-222222222221',
  '{"weekLabel":"Week of Sep 15–21 · Core Supply Co-op","availableBalance":8920.4,"pendingBalance":2410.75,"paidThisMonth":24680,"nextPayoutDate":"2026-09-25","netTerms":"Net-7 via FreshLink","lines":[{"id":"pay-1","orderRef":"FL-1042","facility":"Hope Harbor Shelter","weekOf":"2026-09-22","amount":742.1,"status":"pending","method":"ACH"},{"id":"pay-2","orderRef":"FL-1044","facility":"Riverfront Senior Home","weekOf":"2026-09-22","amount":418.6,"status":"pending","method":"ACH"},{"id":"pay-3","orderRef":"FL-1046","facility":"Southwest Senior Residences","weekOf":"2026-09-22","amount":564.0,"status":"pending","method":"ACH"},{"id":"pay-4","orderRef":"FL-1038","facility":"Riverfront Senior Home","weekOf":"2026-09-15","amount":486.2,"status":"paid","method":"ACH"},{"id":"pay-5","orderRef":"FL-1035","facility":"Eastside Group Home","weekOf":"2026-09-15","amount":312.8,"status":"paid","method":"ACH"},{"id":"pay-6","orderRef":"FL-1039","facility":"Midtown Recovery House","weekOf":"2026-09-15","amount":388.4,"status":"paid","method":"ACH"},{"id":"pay-7","orderRef":"FL-1031","facility":"Hope Harbor Shelter","weekOf":"2026-09-08","amount":598.0,"status":"paid","method":"ACH"},{"id":"pay-8","orderRef":"SUR-094","facility":"Surplus marketplace · 6 buyers","weekOf":"2026-09-18","amount":286.75,"status":"pending","method":"ACH"}]}'::jsonb
);

INSERT INTO partner_earnings (partner_id, payload) VALUES (
  '22222222-2222-2222-2222-222222222224',
  '{"weekLabel":"Week of Sep 15–21 · GreenRoute Logistics","weeklyRevenue":2684,"revenuePerStop":8.9,"onTimeRate":96,"co2AvoidedLb":312,"foodDeliveredLb":24800,"utilizationSweetSpot":"75–90%","byRoute":[{"code":"D-11","zone":"Midtown","day":"Tue","stops":2,"miles":11.8,"bonus":24,"fee":198.0},{"code":"D-12","zone":"Eastside","day":"Tue","stops":3,"miles":18.4,"bonus":38,"fee":226.1},{"code":"D-13","zone":"Southwest","day":"Wed","stops":2,"miles":15.2,"bonus":28,"fee":188.0},{"code":"D-14","zone":"Northwest","day":"Thu","stops":2,"miles":16.6,"bonus":22,"fee":180.0},{"code":"D-15","zone":"Corktown","day":"Fri","stops":2,"miles":10.4,"bonus":18,"fee":164.0},{"code":"D-16","zone":"Eastside","day":"Thu","stops":2,"miles":13.1,"bonus":32,"fee":236.0},{"code":"D-18","zone":"Southwest","day":"Tue","stops":2,"miles":14.8,"bonus":26,"fee":210.0}],"consolidation":{"insight":"Merging six single-kitchen drops into D-11, D-12, and D-13 earned +$90 this week while driving 41 fewer miles than separate trips.","baselineTrips":14,"baselineMiles":72.4,"consolidatedRoutes":7,"consolidatedMiles":31.6,"feeSavingsPerFacility":14.8,"fillRatePct":94}}'::jsonb
);

INSERT INTO orders (id, facility_id, week_of, status, food_total, delivery_fee, delivery_savings, baseline_total, meta)
VALUES
  ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', '2026-09-15', 'fulfilled', 1874.00, 65.00, 40.00, 2210.00,
   '{"orderRef":"FL-1031","cadence":"Recurring weekly","route":"D-16","window":"Tue, Sep 16 · 2–4 PM","temperature":"Refrigerated · 34–40°F","payment":"Net-7 via FreshLink","icon":"🏠","itemPreview":"Brown rice · Chicken thighs · Black beans · Whole milk"}'::jsonb),
  ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111112', '2026-09-22', 'pending_review', 1420.00, 58.00, 32.00, 1688.00,
   '{"orderRef":"FL-1044","cadence":"Recurring weekly","route":"D-11","window":"Tue, Sep 22 · 8–10 AM","temperature":"Refrigerated · 34–40°F","payment":"Net-7 via FreshLink","icon":"🏡","itemPreview":"Whole wheat bread · Eggs · Yogurt · Sweet potatoes"}'::jsonb),
  ('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111113', '2026-09-22', 'pending_review', 612.00, 42.00, 18.00, 740.00,
   '{"orderRef":"FL-1045","cadence":"Recurring weekly","route":"D-12","window":"Tue, Sep 23 · 9–11 AM","temperature":"Ambient + cold","payment":"Net-7 via FreshLink","icon":"🏘️","itemPreview":"Black beans · Apples · Lentils"}'::jsonb),
  ('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111114', '2026-09-22', 'approved', 486.00, 36.00, 14.00, 590.00,
   '{"orderRef":"FL-1047","cadence":"Biweekly","route":"D-15","window":"Fri, Sep 25 · 9–11 AM","temperature":"Ambient","payment":"Net-7 via FreshLink","icon":"🏠","itemPreview":"Corn tortillas · Turkey chili · Canned peaches"}'::jsonb),
  ('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111115', '2026-09-15', 'fulfilled', 704.00, 48.00, 22.00, 860.00,
   '{"orderRef":"FL-1039","cadence":"Recurring weekly","route":"D-11","window":"Tue, Sep 16 · 8–10 AM","temperature":"Ambient + cold","payment":"Net-7 via FreshLink","icon":"🏠","itemPreview":"Rolled oats · Black beans · Whole milk"}'::jsonb),
  ('44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111116', '2026-09-22', 'pending_review', 1688.00, 62.00, 36.00, 1995.00,
   '{"orderRef":"FL-1046","cadence":"Recurring weekly","route":"D-13","window":"Wed, Sep 23 · 11 AM–1 PM","temperature":"Refrigerated · 34–40°F","payment":"Net-7 via FreshLink","icon":"🏡","itemPreview":"Chicken thighs · Frozen peas · Whole wheat bread · Cheddar"}'::jsonb);

INSERT INTO order_items (order_id, product_id, partner_id, quantity, unit_price, line_total, source_tag, is_surplus) VALUES
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222221', 2, 21.40, 42.80, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333318', '22222222-2222-2222-2222-222222222221', 1, 72.40, 72.40, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222221', 2, 18.75, 37.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222221', 2, 28.50, 57.00, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222222', 1, 41.25, 41.25, 'Local farm', false),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333310', '22222222-2222-2222-2222-222222222223', 1, 24.00, 24.00, 'Grocery partner', false),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222222', 1, 22.60, 22.60, 'Local farm', false),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222221', 1, 38.50, 38.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222221', 2, 18.75, 37.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222223', 1, 18.00, 18.00, 'Surplus rescue', true),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333321', '22222222-2222-2222-2222-222222222221', 1, 17.10, 17.10, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333319', '22222222-2222-2222-2222-222222222223', 1, 15.50, 15.50, 'Grocery partner', false),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333314', '22222222-2222-2222-2222-222222222223', 1, 26.75, 26.75, 'Grocery partner', false),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333320', '22222222-2222-2222-2222-222222222223', 1, 14.20, 14.20, 'Surplus rescue', true),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222221', 1, 18.75, 18.75, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333313', '22222222-2222-2222-2222-222222222221', 2, 16.80, 33.60, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222221', 2, 18.75, 37.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222221', 1, 38.50, 38.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333318', '22222222-2222-2222-2222-222222222221', 2, 72.40, 144.80, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333317', '22222222-2222-2222-2222-222222222221', 2, 19.25, 38.50, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222221', 2, 28.50, 57.00, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333316', '22222222-2222-2222-2222-222222222221', 1, 42.00, 42.00, 'Core Supply Co-op', false),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222222', 1, 12.80, 12.80, 'Local', true);
