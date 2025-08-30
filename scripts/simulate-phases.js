const fs = require('fs')
const path = require('path')

// Couleurs pour la console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

async function simulateCounterPhases() {
  const baseUrl = 'http://localhost:3000'
  
  log('🧪 Simulation des phases du compteur', 'blue')
  log('=' .repeat(60), 'blue')
  
  try {
    // Test initial - récupérer la valeur de base
    log('📖 Récupération de la valeur initiale...', 'yellow')
    const initialResponse = await fetch(`${baseUrl}/api/counter`)
    const initialData = await initialResponse.json()
    
    if (!initialData.success) {
      log(`❌ Erreur: ${initialData.error}`, 'red')
      return
    }
    
    const startValue = initialData.value
    log(`✅ Valeur initiale: ${startValue}`, 'green')
    
    // Simulation Phase 1: Démarrage rapide (0-10 secondes)
    log('\n🚀 PHASE 1: Démarrage rapide (2-3 incr. toutes les 1-1.5s)', 'cyan')
    log('-'.repeat(50), 'cyan')
    
    for (let i = 0; i < 5; i++) {
      const increment = Math.floor(Math.random() * 2) + 2 // 2-3
      const delay = Math.random() * 500 + 1000 // 1-1.5 secondes
      
      log(`  Incrémentation +${increment} dans ${Math.round(delay)}ms...`, 'cyan')
      
      await new Promise(resolve => setTimeout(resolve, delay))
      
      const response = await fetch(`${baseUrl}/api/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment }),
      })
      
      const data = await response.json()
      if (data.success) {
        log(`  ✅ Nouvelle valeur: ${data.value} (+${data.value - startValue} total)`, 'green')
      } else {
        log(`  ❌ Erreur: ${data.error}`, 'red')
      }
    }
    
    // Simulation Phase 2: Ralentissement (10-30 secondes)
    log('\n🔄 PHASE 2: Ralentissement (1 incr. toutes les 3-4s)', 'yellow')
    log('-'.repeat(50), 'yellow')
    
    for (let i = 0; i < 3; i++) {
      const increment = 1
      const delay = Math.random() * 1000 + 3000 // 3-4 secondes
      
      log(`  Incrémentation +${increment} dans ${Math.round(delay)}ms...`, 'yellow')
      
      await new Promise(resolve => setTimeout(resolve, delay))
      
      const response = await fetch(`${baseUrl}/api/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment }),
      })
      
      const data = await response.json()
      if (data.success) {
        log(`  ✅ Nouvelle valeur: ${data.value} (+${data.value - startValue} total)`, 'green')
      }
    }
    
    // Simulation Phase 3: Rythme lent (30-60 secondes)
    log('\n🐌 PHASE 3: Rythme lent (1 incr. toutes les 10-12s)', 'magenta')
    log('-'.repeat(50), 'magenta')
    
    for (let i = 0; i < 2; i++) {
      const increment = 1
      const delay = Math.random() * 2000 + 10000 // 10-12 secondes (réduit pour le test)
      const shortDelay = delay / 5 // Raccourci pour le test
      
      log(`  Incrémentation +${increment} dans ${Math.round(shortDelay)}ms (raccourci de ${Math.round(delay)}ms)...`, 'magenta')
      
      await new Promise(resolve => setTimeout(resolve, shortDelay))
      
      const response = await fetch(`${baseUrl}/api/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment }),
      })
      
      const data = await response.json()
      if (data.success) {
        log(`  ✅ Nouvelle valeur: ${data.value} (+${data.value - startValue} total)`, 'green')
      }
    }
    
    // Simulation Phase 4: Bursts périodiques
    log('\n🎆 PHASE 4: Bursts périodiques (5-20 incr. parfois)', 'red')
    log('-'.repeat(50), 'red')
    
    for (let i = 0; i < 3; i++) {
      const isBurst = Math.random() < 0.6 // 60% de chance pour le test
      const increment = isBurst ? Math.floor(Math.random() * 16) + 5 : 1 // 5-20 ou 1
      const delay = Math.random() * 5000 + 2000 // Raccourci pour le test
      
      log(`  ${isBurst ? '💥 BURST' : 'Normal'} +${increment} dans ${Math.round(delay)}ms...`, isBurst ? 'red' : 'yellow')
      
      await new Promise(resolve => setTimeout(resolve, delay))
      
      const response = await fetch(`${baseUrl}/api/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment }),
      })
      
      const data = await response.json()
      if (data.success) {
        log(`  ✅ Nouvelle valeur: ${data.value} (+${data.value - startValue} total)`, 'green')
      }
    }
    
    // Simulation Phase 5: Incrémentation régulière (toutes les 2 minutes)
    log('\n⏰ PHASE 5: Incrémentation régulière (1-3 incr. toutes les 2min)', 'blue')
    log('-'.repeat(50), 'blue')
    
    const increment = Math.floor(Math.random() * 3) + 1 // 1-3
    const delay = 5000 // Raccourci pour le test (normalement 120000ms = 2min)
    
    log(`  Incrémentation +${increment} dans ${delay}ms (raccourci de 2 minutes)...`, 'blue')
    
    await new Promise(resolve => setTimeout(resolve, delay))
    
    const response = await fetch(`${baseUrl}/api/counter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment }),
    })
    
    const data = await response.json()
    if (data.success) {
      log(`  ✅ Nouvelle valeur: ${data.value} (+${data.value - startValue} total)`, 'green')
    }
    
    // Résumé final
    const finalResponse = await fetch(`${baseUrl}/api/counter`)
    const finalData = await finalResponse.json()
    
    log('\n📊 RÉSUMÉ DE LA SIMULATION', 'green')
    log('=' .repeat(60), 'green')
    log(`Valeur initiale: ${startValue}`, 'green')
    log(`Valeur finale: ${finalData.value}`, 'green')
    log(`Total ajouté: +${finalData.value - startValue}`, 'green')
    log('🎉 Simulation terminée avec succès!', 'green')
    
  } catch (error) {
    log(`❌ Erreur lors de la simulation: ${error.message}`, 'red')
    log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)', 'yellow')
  }
}

// Vérifier si le serveur est en cours d'exécution
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000')
    return response.status === 200
  } catch {
    return false
  }
}

async function main() {
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    log('❌ Le serveur Next.js ne semble pas être en cours d\'exécution', 'red')
    log('💡 Démarrez le serveur avec: npm run dev', 'yellow')
    process.exit(1)
  }
  
  await simulateCounterPhases()
}

main()
