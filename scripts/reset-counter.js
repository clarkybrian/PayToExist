const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

async function resetAndTestCounter() {
  const baseUrl = 'http://localhost:3000'
  
  log('🔄 Réinitialisation et test du compteur', 'blue')
  log('=' .repeat(50), 'blue')
  
  try {
    // 1. Réinitialiser le compteur à 1
    log('🔄 Étape 1: Réinitialisation du compteur...', 'yellow')
    const resetResponse = await fetch(`${baseUrl}/api/counter/reset`, {
      method: 'POST'
    })
    const resetData = await resetResponse.json()
    
    if (resetData.success) {
      log(`✅ Compteur réinitialisé: ${resetData.value}`, 'green')
    } else {
      log(`❌ Erreur de réinitialisation: ${resetData.error}`, 'red')
      return
    }
    
    // 2. Vérifier la valeur
    log('\n📖 Étape 2: Vérification de la valeur...', 'yellow')
    const getResponse = await fetch(`${baseUrl}/api/counter`)
    const getData = await getResponse.json()
    
    if (getData.success) {
      log(`✅ Valeur actuelle: ${getData.value}`, 'green')
    } else {
      log(`❌ Erreur: ${getData.error}`, 'red')
    }
    
    // 3. Simuler quelques incrémentations
    log('\n📈 Étape 3: Test d\'incrémentations...', 'yellow')
    
    for (let i = 1; i <= 5; i++) {
      const increment = Math.floor(Math.random() * 3) + 1 // 1-3
      log(`  Incrémentation ${i}: +${increment}`, 'blue')
      
      const response = await fetch(`${baseUrl}/api/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment }),
      })
      
      const data = await response.json()
      if (data.success) {
        log(`  ✅ Nouvelle valeur: ${data.value}`, 'green')
      } else {
        log(`  ❌ Erreur: ${data.error}`, 'red')
      }
      
      // Attendre un peu entre les incrémentations
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // 4. Vérifier la valeur finale
    log('\n🔍 Étape 4: Vérification finale...', 'yellow')
    const finalResponse = await fetch(`${baseUrl}/api/counter`)
    const finalData = await finalResponse.json()
    
    if (finalData.success) {
      log(`✅ Valeur finale: ${finalData.value}`, 'green')
      log(`📊 Total incrémenté: +${finalData.value - 1}`, 'green')
    }
    
    log('\n🎉 Test terminé! Le compteur devrait maintenant démarrer à 1 et persister ses valeurs.', 'green')
    log('💡 Actualisez la page dans votre navigateur pour voir la persistance.', 'yellow')
    
  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red')
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
  
  await resetAndTestCounter()
}

main()
