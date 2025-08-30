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

interface Language {
  code: string
  name: string
  title: string
  position: string
  recentConfirmations: string
  loading: string
}

const languages: Language[] = [
  { 
    code: 'fr', 
    name: '🇫🇷 Français', 
    title: 'Payez 1€ pour prouver que vous existez',
    position: 'Votre position',
    recentConfirmations: 'Confirmations récentes',
    loading: 'Chargement...'
  },
  { 
    code: 'en', 
    name: '🇺🇸 English', 
    title: 'Pay to prove that you exist',
    position: 'Your position',
    recentConfirmations: 'Recent confirmations',
    loading: 'Loading...'
  },
  { 
    code: 'es', 
    name: '🇪🇸 Español', 
    title: 'Paga para demostrar que existes',
    position: 'Tu posición',
    recentConfirmations: 'Confirmaciones recientes',
    loading: 'Cargando...'
  },
  { 
    code: 'de', 
    name: '🇩🇪 Deutsch', 
    title: 'Bezahlen Sie, um zu beweisen, dass Sie existieren',
    position: 'Ihre Position',
    recentConfirmations: 'Aktuelle Bestätigungen',
    loading: 'Laden...'
  },
  { 
    code: 'it', 
    name: '🇮🇹 Italiano', 
    title: 'Paga per dimostrare che esisti',
    position: 'La tua posizione',
    recentConfirmations: 'Conferme recenti',
    loading: 'Caricamento...'
  },
  { 
    code: 'pt', 
    name: '🇧🇷 Português', 
    title: 'Pague para provar que você existe',
    position: 'Sua posição',
    recentConfirmations: 'Confirmações recentes',
    loading: 'Carregando...'
  },
  { 
    code: 'zh', 
    name: '🇨🇳 中文', 
    title: '付费证明你的存在',
    position: '您的位置',
    recentConfirmations: '最近确认',
    loading: '加载中...'
  },
  { 
    code: 'ja', 
    name: '🇯🇵 日本語', 
    title: 'あなたが存在することを証明するために支払う',
    position: 'あなたの位置',
    recentConfirmations: '最近の確認',
    loading: '読み込み中...'
  },
  { 
    code: 'ar', 
    name: '🇸🇦 العربية', 
    title: 'ادفع لتثبت أنك موجود',
    position: 'موقعك',
    recentConfirmations: 'التأكيدات الأخيرة',
    loading: 'جاري التحميل...'
  },
  { 
    code: 'ru', 
    name: '🇷🇺 Русский', 
    title: 'Заплатите, чтобы доказать, что вы существуете',
    position: 'Ваше местоположение',
    recentConfirmations: 'Недавние подтверждения',
    loading: 'Загрузка...'
  }
]

export default function Home() {
  const [stats, setStats] = useState<Stats>({ totalPayments: 0, payments: [] })
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]) // Français par défaut

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
        <div className="text-xl">{selectedLanguage.loading}</div>
      </div>
    )
  }

  return (
    <div className="page-container bg-white">
      {/* Sélecteur de langues */}
      <div className="absolute top-4 right-4 z-10">
        <select 
          value={selectedLanguage.code}
          onChange={(e) => {
            const lang = languages.find(l => l.code === e.target.value)
            if (lang) setSelectedLanguage(lang)
          }}
          className="bg-white border border-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm shadow-md hover:border-gray-400 transition-colors"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Layout principal : Sphère à gauche, contenu à droite */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 min-h-[70vh]">
        {/* Sphère du monde - Gauche */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-[600px] h-96 sm:h-[500px] md:h-[600px]">
            <WorldSphere 
              payments={stats.payments} 
              onLocationClick={handleLocationClick}
            />
          </div>
        </div>

        {/* Contenu principal - Droite */}
        <div className="w-full lg:w-1/2 lg:pl-8">
          <div className="text-center">
            {/* Titre principal */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 lg:mb-8">
              {selectedLanguage.title} : {stats.totalPayments}
            </h1>

            {/* Bouton de paiement */}
            <button
              onClick={handlePayment}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg sm:text-xl transition-colors duration-200 mb-6"
            >
              Pay To Exist
            </button>

            {/* Informations de localisation */}
            {userLocation && (
              <div className="mb-6 text-gray-600 text-sm lg:text-base">
                <p>{selectedLanguage.position}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
              </div>
            )}

            {/* Liste des récents paiements */}
            {stats.payments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg sm:text-xl font-bold text-black mb-4 lg:mb-6 text-center">{selectedLanguage.recentConfirmations}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.payments.slice(0, 4).map((payment, index) => (
                    <div key={payment.id || index} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-semibold text-sm">{payment.city}</p>
                      <p className="text-gray-600 text-xs">{payment.country}</p>
                      <p className="text-xs text-gray-500">
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

      {/* Footer - toujours au bas de la page */}
      <footer className="bg-white py-3 sm:py-4 mt-auto">
        <div className="container mx-auto px-2 sm:px-4 text-center text-gray-500 text-xs">
          © 2025 Pay To Exist. Tous droits réservés. | Concept original by Clark
        </div>
      </footer>
    </div>
  )
}
