-- FacturePro - Schéma multi-tenant
-- Exécuter dans l'éditeur SQL Supabase

-- Company profile (1 par user)
CREATE TABLE IF NOT EXISTS company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone TEXT,
  logo_url TEXT,
  vat_exempt BOOLEAN DEFAULT false,
  vat_number TEXT,
  payment_delay_days INTEGER DEFAULT 30,
  late_penalty_rate NUMERIC(5,2),
  late_penalty_fixed NUMERIC(10,2),
  legal_mention TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  email TEXT,
  phone TEXT,
  siret TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Devis
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected')),
  issue_date DATE NOT NULL,
  valid_until DATE,
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 20,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, number)
);

-- Lignes devis
CREATE TABLE IF NOT EXISTS quote_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Factures
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue')),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 20,
  note TEXT,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, number)
);

-- Lignes facture
CREATE TABLE IF NOT EXISTS invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Compteurs numérotation (par user, année, type)
CREATE TABLE IF NOT EXISTS numbering_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('invoice','quote')),
  last_number INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, year, type)
);

-- RLS
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE numbering_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own company_profile" ON company_profile FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own quotes" ON quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own quote_lines via quotes" ON quote_lines FOR ALL USING (EXISTS (SELECT 1 FROM quotes q WHERE q.id = quote_id AND q.user_id = auth.uid()));
CREATE POLICY "Users own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own invoice_lines via invoices" ON invoice_lines FOR ALL USING (EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid()));
CREATE POLICY "Users own numbering_counters" ON numbering_counters FOR ALL USING (auth.uid() = user_id);

-- Storage pour logos (bucket privé, policy par user)
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Users can upload logo" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can read logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
