-- Pilot scenario seed (Hope Harbor / Core Supply / GreenRoute)

INSERT INTO facilities (id, name, slug, resident_count, weekly_budget, diet_tags, contact_initials)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Hope Harbor Shelter', 'hope-harbor', 75, 2400.00,
   ARRAY['Low-sodium','Diabetes-conscious','Easy-chew','Culturally responsive'], 'DM'),
  ('11111111-1111-1111-1111-111111111112', 'Riverfront Senior Home', 'riverfront-senior', 48, 1800.00,
   ARRAY['Low-sodium','Easy-chew'], 'RS'),
  ('11111111-1111-1111-1111-111111111113', 'Eastside Group Home', 'eastside-group', 22, 900.00,
   ARRAY['Diabetes-conscious'], 'EG');

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
  ('33333333-3333-3333-3333-333333333310', 'Yogurt, plain · 12 qt', 'case', 'dairy', '🫙', ARRAY['grocer']);

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
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333310', 35, 24.00, 'warn');

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
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222221', 3, 18.75, 56.25, 'Core Supply Co-op', false);

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
   'pending');

INSERT INTO routes (id, partner_id, code, delivery_date, window_label, status, capacity_pct, miles_saved, is_ev, temp_c, earnings) VALUES
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222224', 'D-12', '2026-09-23', '9–11 AM', 'accepted', 82, 118, true, 3.2, 245.00),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222224', 'D-14', '2026-09-23', '1–3 PM', 'offered', 76, 64, true, 2.8, 180.00),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222224', 'D-18', '2026-09-23', '3–5 PM', 'offered', 88, 92, true, 3.5, 210.00);

INSERT INTO route_stops (route_id, facility_id, stop_order, label, detail, status) VALUES
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111111', 1, 'Hope Harbor Shelter', 'Bulk cold + dry · dock B', 'delivered'),
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111112', 2, 'Riverfront Senior Home', 'Cold chain required', 'en_route'),
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111113', 3, 'Eastside Group Home', 'Small drop · 8 cases', 'pending'),
  ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111112', 1, 'Riverfront Senior Home', 'Produce-heavy', 'pending'),
  ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111113', 2, 'Eastside Group Home', 'Surplus apples', 'pending');

INSERT INTO impact_metrics (facility_id, month_label, meals_supported, dollars_saved, local_spend_pct, surplus_lb, on_time_pct, deliveries_on_time, deliveries_total, fill_rate_pct, monthly_savings)
VALUES (
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
);

-- Invite-only pilot logins. Password for all three: Pilot2026!
INSERT INTO users (id, email, password_hash, name, role, facility_id, partner_id, status) VALUES
  ('77777777-7777-7777-7777-777777777701', 'dana@hopeharbor.org',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Dana Morris', 'facility', '11111111-1111-1111-1111-111111111111', NULL, 'active'),
  ('77777777-7777-7777-7777-777777777702', 'aisha@coresupply.org',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Aisha Rahman', 'food', NULL, '22222222-2222-2222-2222-222222222221', 'active'),
  ('77777777-7777-7777-7777-777777777703', 'marcus@greenroute.org',
   '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
   'Marcus Lee', 'transport', NULL, '22222222-2222-2222-2222-222222222224', 'active');

INSERT INTO vehicles (id, partner_id, code, type, status, temp_zones, capacity_pct, battery_pct, assigned_route, mileage) VALUES
  ('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222224', 'EV-02', 'Cargo van', 'available', 'Refrigerated', 0, 94, NULL, 18240),
  ('88888888-8888-8888-8888-888888888802', '22222222-2222-2222-2222-222222222224', 'EV-04', 'Cargo van', 'on_route', 'Ambient', 74, 68, 'D-11', 22110),
  ('88888888-8888-8888-8888-888888888803', '22222222-2222-2222-2222-222222222224', 'EV-07', 'Refrigerated van', 'on_route', 'Refrig + ambient', 88, 61, 'D-12', 15480),
  ('88888888-8888-8888-8888-888888888804', '22222222-2222-2222-2222-222222222224', 'EV-09', 'Cargo van', 'charging', 'Ambient', 0, 22, NULL, 9800),
  ('88888888-8888-8888-8888-888888888805', '22222222-2222-2222-2222-222222222224', 'EV-11', 'Refrigerated van', 'maintenance', 'Refrigerated', 0, 100, NULL, 30120);

INSERT INTO drivers (id, partner_id, name, initials, status, vehicle, route, stops_done, stops_total, on_time_pct, phone) VALUES
  ('99999999-9999-9999-9999-999999999901', '22222222-2222-2222-2222-222222222224', 'Marcus T.', 'MT', 'on_route', 'EV-07', 'D-12', 1, 4, 98, 'On shift · Eastside'),
  ('99999999-9999-9999-9999-999999999902', '22222222-2222-2222-2222-222222222224', 'Alicia R.', 'AR', 'on_route', 'EV-04', 'D-11', 2, 3, 96, 'On shift · Midtown'),
  ('99999999-9999-9999-9999-999999999903', '22222222-2222-2222-2222-222222222224', 'Jamal K.', 'JK', 'available', 'EV-02', NULL, 0, 0, 97, 'Standby · Southwest'),
  ('99999999-9999-9999-9999-999999999904', '22222222-2222-2222-2222-222222222224', 'Sofia M.', 'SM', 'off_shift', NULL, NULL, 0, 0, 94, 'Next shift Thu 7 AM'),
  ('99999999-9999-9999-9999-999999999905', '22222222-2222-2222-2222-222222222224', 'Devon P.', 'DP', 'break', NULL, NULL, 0, 0, 99, 'Returns Fri');

INSERT INTO demand_forecasts (partner_id, payload) VALUES (
  '22222222-2222-2222-2222-222222222221',
  '{"recurringRevenue":8420,"repeatFacilities":14,"avgOrderValue":486,"surplusRecoveredTons":2.1,"demandByCategory":[{"label":"Produce","pct":86,"volume":"1,860 lb"},{"label":"Dairy","pct":64,"volume":"1,240 gal"},{"label":"Protein","pct":58,"volume":"1,090 lb"},{"label":"Pantry","pct":34,"volume":"640 lb"}],"weeklyTrend":[34,42,38,52,58,64,78,100],"aiInsight":"Facility demand for produce is trending +42 lb. Pull harvest and storage plans forward — Michigan apples and sweet potatoes will carry most of it.","surplusMedianHours":31}'::jsonb
);

INSERT INTO partner_payouts (partner_id, payload) VALUES (
  '22222222-2222-2222-2222-222222222221',
  '{"weekLabel":"Week of Sep 15–21 · Core Supply Co-op","availableBalance":6240.5,"pendingBalance":1675.25,"paidThisMonth":18420,"nextPayoutDate":"2026-09-25","netTerms":"Net-7 via FreshLink","lines":[{"id":"pay-1","orderRef":"FL-1042","facility":"Hope Harbor Shelter","weekOf":"2026-09-22","amount":612.4,"status":"pending","method":"ACH"},{"id":"pay-2","orderRef":"FL-1038","facility":"Riverfront Senior Home","weekOf":"2026-09-15","amount":486.2,"status":"paid","method":"ACH"},{"id":"pay-3","orderRef":"FL-1035","facility":"Eastside Group Home","weekOf":"2026-09-15","amount":312.8,"status":"paid","method":"ACH"},{"id":"pay-4","orderRef":"FL-1031","facility":"Hope Harbor Shelter","weekOf":"2026-09-08","amount":598.0,"status":"paid","method":"ACH"},{"id":"pay-5","orderRef":"SUR-092","facility":"Surplus marketplace · 4 buyers","weekOf":"2026-09-18","amount":214.5,"status":"pending","method":"ACH"}]}'::jsonb
);

INSERT INTO partner_earnings (partner_id, payload) VALUES (
  '22222222-2222-2222-2222-222222222224',
  '{"weekLabel":"Week of Sep 15–21 · GreenRoute Logistics","weeklyRevenue":1984,"revenuePerStop":8.4,"onTimeRate":96,"co2AvoidedLb":214,"foodDeliveredLb":18600,"utilizationSweetSpot":"75–90%","byRoute":[{"code":"D-11","zone":"Midtown","day":"Tue","stops":3,"miles":14.2,"bonus":21,"fee":182.4},{"code":"D-12","zone":"Eastside","day":"Tue","stops":3,"miles":18.4,"bonus":38,"fee":226.1},{"code":"D-13","zone":"Southwest","day":"Wed","stops":3,"miles":16.1,"bonus":26,"fee":204.75},{"code":"D-14","zone":"Northwest","day":"Thu","stops":3,"miles":19.8,"bonus":30,"fee":218.9},{"code":"D-15","zone":"Corktown","day":"Fri","stops":3,"miles":12.6,"bonus":19,"fee":171.25}],"consolidation":{"insight":"Merging 3 single facility deliveries into Route D-12 earned +$38 this week while driving 26 fewer miles than separate trips.","baselineTrips":9,"baselineMiles":46.3,"consolidatedRoutes":3,"consolidatedMiles":18.4,"feeSavingsPerFacility":13.3,"fillRatePct":94}}'::jsonb
);
