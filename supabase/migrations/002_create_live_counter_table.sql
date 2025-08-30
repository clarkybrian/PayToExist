-- Créer la table pour stocker le compteur en temps réel
CREATE TABLE IF NOT EXISTS live_counter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  counter_value INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer une valeur initiale (il n'y aura qu'une seule ligne dans cette table)
INSERT INTO live_counter (counter_value) VALUES (0)
ON CONFLICT DO NOTHING;

-- Créer un index sur updated_at
CREATE INDEX IF NOT EXISTS idx_live_counter_updated_at ON live_counter(updated_at DESC);

-- Activer RLS (Row Level Security)
ALTER TABLE live_counter ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Lecture publique du compteur" ON live_counter
FOR SELECT USING (true);

-- Politique pour permettre la mise à jour depuis les APIs
CREATE POLICY "Mise à jour du compteur via API" ON live_counter
FOR UPDATE USING (true);

-- Fonction pour mettre à jour automatiquement le timestamp
CREATE OR REPLACE FUNCTION update_live_counter_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER trigger_update_live_counter_timestamp
  BEFORE UPDATE ON live_counter
  FOR EACH ROW
  EXECUTE FUNCTION update_live_counter_timestamp();

-- Fonction pour incrémenter le compteur de manière atomique
CREATE OR REPLACE FUNCTION increment_live_counter(increment_value INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
DECLARE
  new_value INTEGER;
BEGIN
  UPDATE live_counter 
  SET counter_value = counter_value + increment_value
  WHERE id = (SELECT id FROM live_counter LIMIT 1)
  RETURNING counter_value INTO new_value;
  
  RETURN new_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
