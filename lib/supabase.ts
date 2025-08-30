import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || process.env.SUPABASE_API_KEY!

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
    console.error('Erreur lors de l\'ajout du paiement:', error)
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
    console.error('Erreur lors de la récupération du nombre de paiements:', error)
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
    console.error('Erreur lors de la récupération des paiements:', error)
    return []
  }

  return data || []
}
