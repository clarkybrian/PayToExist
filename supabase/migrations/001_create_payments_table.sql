-- Créer la table pour stocker les paiements
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur created_at pour les requêtes de tri
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Créer un index spatial pour les requêtes de géolocalisation
CREATE INDEX IF NOT EXISTS idx_payments_location ON payments(latitude, longitude);

-- Activer RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Lecture publique des paiements" ON payments
FOR SELECT USING (true);

-- Politique pour permettre l'insertion depuis les APIs
CREATE POLICY "Insertion des paiements via API" ON payments
FOR INSERT WITH CHECK (true);
