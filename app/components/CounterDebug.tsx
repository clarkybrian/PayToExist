import { useState, useEffect } from 'react'

interface CounterDebugProps {
  startTime?: number
  visible?: boolean
}

export default function CounterDebug({ startTime, visible = false }: CounterDebugProps) {
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [nextIncrement, setNextIncrement] = useState<string>('')

  useEffect(() => {
    if (!startTime || !visible) return

    const updateDebugInfo = () => {
      const elapsed = Date.now() - startTime
      setElapsedTime(elapsed)

      let phase = 0
      let phaseInfo = ''

      if (elapsed < 10000) {
        phase = 1
        phaseInfo = 'Démarrage rapide (2-3 incr. / 1-1.5s)'
      } else if (elapsed < 30000) {
        phase = 2
        phaseInfo = 'Ralentissement (1 incr. / 3-4s)'
      } else if (elapsed < 60000) {
        phase = 3
        phaseInfo = 'Rythme lent (1 incr. / 10-12s)'
      } else if (elapsed < 120000) {
        phase = 4
        phaseInfo = 'Bursts périodiques (5-20 incr. / 10-15s)'
      } else if (elapsed < 240000) {
        phase = 5
        phaseInfo = 'Incrémentation régulière (1-3 incr. / 2min)'
      } else {
        phase = 0
        phaseInfo = 'Redémarrage du cycle...'
      }

      setCurrentPhase(phase)
      setNextIncrement(phaseInfo)
    }

    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 100)

    return () => clearInterval(interval)
  }, [startTime, visible])

  if (!visible) return null

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getPhaseColor = (phase: number) => {
    const colors = [
      'bg-gray-500',    // 0 - Redémarrage
      'bg-green-500',   // 1 - Démarrage rapide
      'bg-yellow-500',  // 2 - Ralentissement
      'bg-orange-500',  // 3 - Rythme lent
      'bg-red-500',     // 4 - Bursts
      'bg-blue-500'     // 5 - Régulier
    ]
    return colors[phase] || 'bg-gray-500'
  }

  const getPhaseEmoji = (phase: number) => {
    const emojis = ['🔄', '🚀', '🔄', '🐌', '🎆', '⏰']
    return emojis[phase] || '❓'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-sm font-mono max-w-xs">
      <div className="mb-2">
        <span className="font-bold">Compteur Debug</span>
      </div>
      
      <div className="mb-1">
        <span className="text-gray-300">Temps écoulé:</span> {formatTime(elapsedTime)}
      </div>
      
      <div className="mb-1 flex items-center">
        <span className="text-gray-300">Phase:</span>
        <span className={`ml-2 px-2 py-1 rounded text-xs ${getPhaseColor(currentPhase)}`}>
          {getPhaseEmoji(currentPhase)} Phase {currentPhase}
        </span>
      </div>
      
      <div className="text-xs text-gray-400">
        {nextIncrement}
      </div>
      
      {/* Barre de progression pour la phase actuelle */}
      <div className="mt-2">
        <div className="w-full bg-gray-600 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-100 ${getPhaseColor(currentPhase)}`}
            style={{
              width: `${currentPhase === 1 ? (elapsedTime / 10000 * 100) :
                      currentPhase === 2 ? ((elapsedTime - 10000) / 20000 * 100) :
                      currentPhase === 3 ? ((elapsedTime - 30000) / 30000 * 100) :
                      currentPhase === 4 ? ((elapsedTime - 60000) / 60000 * 100) :
                      currentPhase === 5 ? ((elapsedTime - 120000) / 120000 * 100) : 0}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}
