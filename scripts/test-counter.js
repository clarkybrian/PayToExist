const fs = require('fs')
const path = require('path')

// Couleurs pour la console
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

async function testCounterAPI() {
  const baseUrl = 'http://localhost:3000'
  
  log('🧪 Test de l\'API du compteur', 'blue')
  log('=' .repeat(50), 'blue')
  
  try {
    // Test 1: GET - Récupérer la valeur actuelle
    log('📖 Test 1: Récupération de la valeur actuelle...', 'yellow')
    const getResponse = await fetch(`${baseUrl}/api/counter`)
    const getData = await getResponse.json()
    
    if (getData.success) {
      log(`✅ Valeur actuelle: ${getData.value}`, 'green')
    } else {
      log(`❌ Erreur: ${getData.error}`, 'red')
    }
    
    // Test 2: POST - Incrémenter le compteur
    log('📈 Test 2: Incrémentation du compteur (+5)...', 'yellow')
    const postResponse = await fetch(`${baseUrl}/api/counter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increment: 5 }),
    })
    const postData = await postResponse.json()
    
    if (postData.success) {
      log(`✅ Nouvelle valeur: ${postData.value}`, 'green')
    } else {
      log(`❌ Erreur: ${postData.error}`, 'red')
    }
    
    // Test 3: PUT - Mettre à jour la valeur
    log('🔄 Test 3: Mise à jour de la valeur (12345)...', 'yellow')
    const putResponse = await fetch(`${baseUrl}/api/counter`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: 12345 }),
    })
    const putData = await putResponse.json()
    
    if (putData.success) {
      log(`✅ Valeur mise à jour: ${putData.value}`, 'green')
    } else {
      log(`❌ Erreur: ${putData.error}`, 'red')
    }
    
    // Test 4: GET final - Vérifier la valeur finale
    log('🔍 Test 4: Vérification de la valeur finale...', 'yellow')
    const finalResponse = await fetch(`${baseUrl}/api/counter`)
    const finalData = await finalResponse.json()
    
    if (finalData.success) {
      log(`✅ Valeur finale: ${finalData.value}`, 'green')
    } else {
      log(`❌ Erreur: ${finalData.error}`, 'red')
    }
    
    log('🎉 Tests terminés!', 'green')
    
  } catch (error) {
    log(`❌ Erreur lors des tests: ${error.message}`, 'red')
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
  
  await testCounterAPI()
}

main()
