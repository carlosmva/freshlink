-- Showcase admin can reset the demo dataset. No facility or partner tenant.

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('facility', 'food', 'transport', 'admin'));

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tenant_chk;
ALTER TABLE users ADD CONSTRAINT users_tenant_chk CHECK (
  (role = 'admin' AND facility_id IS NULL AND partner_id IS NULL)
  OR (role = 'facility' AND facility_id IS NOT NULL AND partner_id IS NULL)
  OR (role IN ('food', 'transport') AND partner_id IS NOT NULL AND facility_id IS NULL)
);
