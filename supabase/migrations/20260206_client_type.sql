-- Type de client (particulier / entreprise) et personne à contacter
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS client_type TEXT NOT NULL DEFAULT 'person' CHECK (client_type IN ('person', 'company')),
  ADD COLUMN IF NOT EXISTS contact_name TEXT;

COMMENT ON COLUMN clients.client_type IS 'person = Particulier, company = Entreprise';
COMMENT ON COLUMN clients.contact_name IS 'Personne à contacter (surtout pour entreprise)';
