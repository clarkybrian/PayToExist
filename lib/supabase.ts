import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fonction pour ajouter un paiement
export async function addPayment(city: string, country: string, latitude?: number, longitude?: number) {
  const { data, error } = await supabase
    .from('payments')
    .insert([
      {
        city,
        country,
        latitude,
        longitude,
        created_at: new Date().toISOString()
      }
    ])

  if (error) {
    return null
  }

  return data
}

// Fonction pour récupérer le nombre total de paiements
export async function getTotalPayments() {
  const { count, error } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return 0
  }

  return count || 0
}

// Fonction pour récupérer tous les paiements avec leurs localisations
export async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

// Fonction pour récupérer la valeur du compteur en temps réel
export async function getLiveCounter() {
  const { data, error } = await supabase
    .from('live_counter')
    .select('counter_value')
    .single()

  if (error) {
    return 0
  }

  return data?.counter_value || 0
}

// Fonction pour mettre à jour le compteur en temps réel
export async function updateLiveCounter(newValue: number) {
  const { error } = await supabase
    .from('live_counter')
    .update({ counter_value: newValue })
    .eq('id', (await supabase.from('live_counter').select('id').single()).data?.id)

  if (error) {
    return false
  }

  return true
}

// Fonction pour incrémenter le compteur en temps réel
export async function incrementLiveCounter(incrementBy: number = 1): Promise<number> {
  try {
    // Utiliser la fonction PostgreSQL pour une incrémentation atomique
    const { data, error } = await supabase.rpc('increment_live_counter', {
      increment_value: incrementBy
    });
    
    if (error) {
      // Fallback: méthode manuelle
      const currentValue = await getLiveCounter();
      const newValue = currentValue + incrementBy;
      await updateLiveCounter(newValue);
      return newValue;
    }
    
    return data || 0;
  } catch (error) {
    // Fallback: méthode manuelle
    const currentValue = await getLiveCounter();
    const newValue = currentValue + incrementBy;
    await updateLiveCounter(newValue);
    return newValue;
  }
}
