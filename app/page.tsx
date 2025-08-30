'use client'

import { useState, useEffect } from 'react'
import WorldSphere from '@/components/WorldSphere'
import { STRIPE_PAYMENT_LINK } from '@/lib/stripe'

interface Payment {
  id: string
  city: string
  country: string
  latitude: number
  longitude: number
  created_at: string
}

interface Stats {
  totalPayments: number
  payments: Payment[]
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ totalPayments: 0, payments: [] })
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtenir la géolocalisation de l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Erreur de géolocalisation:', error)
        }
      )
    }
  }

  // Convertir les coordonnées en nom de ville (API reverse geocoding)
  const getCityFromCoords = async (lat: number, lng: number) => {
    try {
      // Utilisation d'une API gratuite pour le reverse geocoding
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=fr`
      )
      const data = await response.json()
      return {
        city: data.city || data.locality || 'Ville inconnue',
        country: data.countryName || 'Pays inconnu'
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la ville:', error)
      return { city: 'Ville inconnue', country: 'Pays inconnu' }
    }
  }

  // Gérer le clic sur le bouton de paiement
  const handlePayment = async () => {
    let locationData = { city: 'Unknown', country: 'Unknown', lat: 0, lng: 0 }

    if (userLocation) {
      const cityData = await getCityFromCoords(userLocation.lat, userLocation.lng)
      locationData = {
        ...cityData,
        lat: userLocation.lat,
        lng: userLocation.lng
      }
    }

    // Rediriger vers Stripe avec les métadonnées de localisation
    const url = new URL(STRIPE_PAYMENT_LINK)
    url.searchParams.append('prefilled_metadata[city]', locationData.city)
    url.searchParams.append('prefilled_metadata[country]', locationData.country)
    url.searchParams.append('prefilled_metadata[latitude]', locationData.lat.toString())
    url.searchParams.append('prefilled_metadata[longitude]', locationData.lng.toString())

    window.open(url.toString(), '_blank')
  }

  // Gérer le clic sur la sphère
  const handleLocationClick = (lat: number, lng: number) => {
    setUserLocation({ lat, lng })
  }

  useEffect(() => {
    fetchStats()
    getUserLocation()
    
    // Actualiser les stats toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sphère du monde */}
      <div className="w-full">
        <WorldSphere 
          payments={stats.payments} 
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Titre principal */}
          <h1 className="text-4xl font-bold text-black mb-8">
            Nombre de personnes qui existent vraiment : {stats.totalPayments}
          </h1>

          {/* Bouton de paiement */}
          <button
            onClick={handlePayment}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-200"
          >
            Je confirme mon existence
          </button>

          {/* Informations de localisation */}
          {userLocation && (
            <div className="mt-6 text-gray-600">
              <p>Votre position: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
            </div>
          )}

          {/* Liste des récents paiements */}
          {stats.payments.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-black mb-4">Confirmations récentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.payments.slice(0, 6).map((payment, index) => (
                  <div key={payment.id || index} className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-semibold">{payment.city}</p>
                    <p className="text-gray-600">{payment.country}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
