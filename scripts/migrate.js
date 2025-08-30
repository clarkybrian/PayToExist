const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Charger les variables d'environnement
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log('🚀 Démarrage de la migration de la base de données...')
    
    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '002_create_live_counter_table.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📖 Lecture du fichier de migration:', migrationPath)
    
    // Diviser le SQL en commandes individuelles
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)
    
    console.log(`📝 ${commands.length} commandes à exécuter`)
    
    // Exécuter chaque commande
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';'
      console.log(`⏳ Exécution de la commande ${i + 1}/${commands.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', { sql: command })
      
      if (error) {
        console.error(`❌ Erreur lors de l'exécution de la commande ${i + 1}:`, error)
        // Continuer avec les autres commandes en cas d'erreur non critique
      } else {
        console.log(`✅ Commande ${i + 1} exécutée avec succès`)
      }
    }
    
    // Vérifier que la table a été créée
    const { data, error } = await supabase
      .from('live_counter')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erreur lors de la vérification de la table:', error)
    } else {
      console.log('✅ Table live_counter créée et accessible')
      console.log('📊 Données actuelles:', data)
    }
    
    console.log('🎉 Migration terminée avec succès!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  }
}

// Exécuter la migration
runMigration()
