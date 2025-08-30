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
  const [userCity, setUserCity] = useState<string | null>(null) // Ville de l'utilisateur
  const [liveCounter, setLiveCounter] = useState(0) // Compteur en temps réel
  const [isRolling, setIsRolling] = useState(false) // Animation de roulette
  const [isCounterLoading, setIsCounterLoading] = useState(true)
  const [lastSync, setLastSync] = useState(Date.now())

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      // Erreur lors de la récupération des statistiques
    } finally {
      setLoading(false)
    }
  }

  // Obtenir la géolocalisation de l'utilisateur - DÉSACTIVÉ pour ne pas déranger les utilisateurs
  /* const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          
          // Récupérer le nom de la ville
          try {
            const locationData = await getCityFromCoords(coords.lat, coords.lng)
            setUserCity(`${locationData.city}, ${locationData.country}`)
          } catch (error) {
            // Erreur lors de la récupération de la ville
            setUserCity('Ville inconnue')
          }
        },
        (error) => {
          // Erreur de géolocalisation
        }
      )
    }
  } */

  // Convertir les coordonnées en nom de ville (API reverse geocoding) - DÉSACTIVÉ
  /* const getCityFromCoords = async (lat: number, lng: number) => {
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
      // Erreur lors de la récupération de la ville
      return { city: 'Ville inconnue', country: 'Pays inconnu' }
    }
  } */

  // Gérer le clic sur le bouton de paiement
  const handlePayment = async () => {
    let locationData = { city: 'Unknown', country: 'Unknown', lat: 0, lng: 0 }

    // Géolocalisation désactivée - utiliser des valeurs par défaut
    /* if (userLocation) {
      const cityData = await getCityFromCoords(userLocation.lat, userLocation.lng)
      locationData = {
        ...cityData,
        lat: userLocation.lat,
        lng: userLocation.lng
      }
    } */

    // Rediriger vers Stripe avec les métadonnées de localisation (génériques)
    const url = new URL(STRIPE_PAYMENT_LINK)
    url.searchParams.append('prefilled_metadata[city]', locationData.city)
    url.searchParams.append('prefilled_metadata[country]', locationData.country)
    url.searchParams.append('prefilled_metadata[latitude]', locationData.lat.toString())
    url.searchParams.append('prefilled_metadata[longitude]', locationData.lng.toString())

    window.open(url.toString(), '_blank')
  }

  // Charger la valeur initiale du compteur depuis la base de données
  useEffect(() => {
    const loadInitialCounter = async () => {
      try {
        const response = await fetch('/api/counter');
        const data = await response.json();
        if (data.success && typeof data.value === 'number') {
          setLiveCounter(data.value);
        } else {
          // Si pas de valeur en base, commencer à 1
          setLiveCounter(1);
        }
      } catch (error) {
        // En cas d'erreur, commencer à 1
        setLiveCounter(1);
      } finally {
        setIsCounterLoading(false);
      }
    };

    // Charger immédiatement au montage du composant
    loadInitialCounter();
  }, []); // Dépendances vides pour charger une seule fois au montage

  // Synchronisation périodique avec la base de données
  useEffect(() => {
    if (isCounterLoading) return;

    const syncInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/counter');
        const data = await response.json();
        if (data.success) {
          setLiveCounter(data.value);
          setLastSync(Date.now());
        }
      } catch (error) {
        // Erreur lors de la synchronisation du compteur
      }
    }, 30000); // Synchroniser toutes les 30 secondes

    return () => clearInterval(syncInterval);
  }, [isCounterLoading]);

  // Animation du compteur avec mise à jour en base de données
  useEffect(() => {
    if (isCounterLoading) return;

    let timeoutId: NodeJS.Timeout;
    let startTime = Date.now();
    let lastSaveTime = Date.now();
    
    // Fonction pour sauvegarder en base de données (toutes les 10 secondes)
    const saveToDatabase = async (currentValue: number) => {
      try {
        const response = await fetch('/api/counter', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: currentValue }),
        });
        const data = await response.json();
        if (data.success) {
          // Sauvegarde réussie
        }
      } catch (error) {
        // Erreur lors de la sauvegarde
      }
    };
    
    const scheduleNextIncrement = () => {
      const elapsedTime = Date.now() - startTime;
      let delay: number;
      let increment: number;
      
      // Phase 1 (0-40 secondes) - Démarrage rapide (x4 plus lent)
      if (elapsedTime < 40000) {
        increment = Math.floor(Math.random() * 2) + 2; // 2-3 incréments
        delay = Math.random() * 2000 + 4000; // 4-6 secondes
      }
      // Phase 2 (40-120 secondes) - Ralentissement (x4 plus lent)
      else if (elapsedTime < 120000) {
        increment = 1;
        delay = Math.random() * 4000 + 12000; // 12-16 secondes
      }
      // Phase 3 (120-240 secondes) - Rythme lent (x4 plus lent)
      else if (elapsedTime < 240000) {
        increment = 1;
        delay = Math.random() * 8000 + 40000; // 40-48 secondes
      }
      // Phase 4 (240-480 secondes) - Bursts périodiques (x4 plus lent)
      else if (elapsedTime < 480000) {
        // 30% de chance d'avoir un burst
        if (Math.random() < 0.3) {
          increment = Math.floor(Math.random() * 16) + 5; // 5-20 incréments
        } else {
          increment = 1;
        }
        delay = Math.random() * 20000 + 40000; // 40-60 secondes
      }
      // Phase 5 (Après 8 minutes) - Incrémentation régulière toutes les 8 minutes
      else {
        // Reset du cycle après 8 minutes + délai de phase 5
        if (elapsedTime > 960000) { // 16 minutes total (8min phases + 8min phase 5)
          startTime = Date.now();
          scheduleNextIncrement();
          return;
        }
        
        increment = Math.floor(Math.random() * 3) + 1; // 1-3 incréments
        delay = 480000; // Exactement 8 minutes
      }
      
      timeoutId = setTimeout(() => {
        // Animation de roulette
        setIsRolling(true);
        
        setTimeout(() => {
          setLiveCounter(prev => {
            const newValue = prev + increment;
            
            // Sauvegarder toutes les 80 secondes (x4 plus lent)
            const now = Date.now();
            if (now - lastSaveTime >= 80000) { // 80 secondes
              saveToDatabase(newValue);
              lastSaveTime = now;
            }
            
            return newValue;
          });
          setIsRolling(false);
          
          // Programmer le prochain incrément
          scheduleNextIncrement();
        }, 300);
      }, delay);
    };

    // Démarrer après 2 secondes pour laisser le temps de charger
    timeoutId = setTimeout(() => {
      scheduleNextIncrement();
    }, 2000);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCounterLoading]);

  // Gérer le clic sur la sphère
  const handleLocationClick = (lat: number, lng: number) => {
    setUserLocation({ lat, lng })
  }

  useEffect(() => {
    fetchStats()
    // getUserLocation() // DÉSACTIVÉ - ne plus demander la localisation aux utilisateurs
    
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
              userLocation={userLocation}
            />
          </div>
        </div>

        {/* Contenu principal - Droite */}
        <div className="w-full lg:w-1/2 lg:pl-8">
          <div className="text-center">
            {/* Titre principal */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2 lg:mb-3">
              {selectedLanguage.title}
            </h1>

            {/* Compteur en dessous avec animation roulette */}
            <div className="mb-6 lg:mb-8">
              <div 
                className={`text-base text-gray-600 transition-all duration-500 transform ${
                  isRolling 
                    ? 'scale-125 -translate-y-2 text-red-500 font-semibold animate-pulse' 
                    : 'scale-100 translate-y-0'
                }`}
                style={{
                  fontVariantNumeric: 'tabular-nums',
                  willChange: 'transform, color'
                }}
              >
                {liveCounter.toLocaleString()} personnes déjà
              </div>
            </div>

            {/* Bouton de paiement */}
            <button
              onClick={handlePayment}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg sm:text-xl transition-colors duration-200 mb-6"
            >
              Pay To Exist
            </button>

            {/* Informations de localisation - Temporairement masquées */}
            {/* {userLocation && (
              <div className="mb-6 text-gray-600 text-sm lg:text-base">
                <p>{selectedLanguage.position}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                {userCity && (
                  <p className="text-gray-700 font-medium mt-1">{userCity}</p>
                )}
              </div>
            )} */}

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
