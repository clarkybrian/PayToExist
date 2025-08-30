# Pay To Exist

Payez 1€ pour prouver que vous existez.

## 🚀 Déploiement sur Netlify

### 1. Prérequis
- Compte GitHub avec le repo poussé
- Compte Netlify
- Base de données Supabase configurée  
- Compte Stripe configuré

### 2. Configuration Netlify

1. **Connecter le repo :**
   - Aller sur [Netlify](https://netlify.com)
   - Cliquer "New site from Git"
   - Connecter GitHub et sélectionner ce repo

2. **Configuration de build :**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Le fichier `netlify.toml` est déjà configuré

3. **Variables d'environnement :**
   Dans Netlify Dashboard > Site settings > Environment variables, ajouter :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_...
   STRIPE_SECRET_KEY=sk_live_or_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Déployer :**
   - Cliquer "Deploy site"
   - Netlify détectera automatiquement Next.js

### 3. Configuration post-déploiement

1. **Webhook Stripe :**
   - Aller dans Stripe Dashboard > Webhooks
   - Ajouter endpoint: `https://your-site.netlify.app/api/webhook`
   - Événements : `checkout.session.completed`

2. **Base de données :**
   - S'assurer que la table `live_counter` existe dans Supabase
   - Exécuter `npm run migrate` localement si nécessaire

## 🛠 Développement

```bash
npm install
npm run dev
```

## 📁 Structure

```
/app
  /api          # Routes API
  page.tsx      # Page principale
/components     # Composants React
/lib           # Utilitaires (Supabase, Stripe)
/public        # Assets statiques
netlify.toml   # Configuration Netlify
```

## 🔧 Scripts

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production  
- `npm run migrate` - Migration base de données
- `npm run test:counter` - Test API compteur

## ✨ Fonctionnalités

- **Sphère terrestre 3D interactive** avec texture réaliste
- **Localisation en temps réel** avec marquage sur la sphère
- **Compteur live** avec animation et synchronisation base de données
- **Système de paiement Stripe** intégré
- **Support multilingue** (français, anglais, espagnol, allemand, italien, portugais, chinois, japonais, arabe, russe)
- **Interface responsive** avec design moderne

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **3D**: React Three Fiber, Three.js
- **Base de données**: Supabase (PostgreSQL)
- **Paiements**: Stripe
- **Géolocalisation**: BigDataCloud API

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd PayToExist
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env.local
```

Modifier `.env.local` avec vos clés :
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Configuration  
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
STRIPE_PAYMENT_LINK=your_payment_link_here
```

4. **Configurer la base de données**
```bash
npm run migrate
```

5. **Démarrer le serveur de développement**
```bash
npm run dev
```

## 📊 Système de compteur live

Le compteur live utilise un système sophistiqué à 5 phases séquentielles basées sur le temps écoulé :

### 🚀 Phase 1: Démarrage rapide (0-10 secondes)
- **Incréments**: 2-3 unités
- **Fréquence**: Toutes les 1-1.5 secondes
- **Objectif**: Donner l'impression d'activité intense au début

### 🔄 Phase 2: Ralentissement (10-30 secondes)  
- **Incréments**: 1 unité
- **Fréquence**: Toutes les 3-4 secondes
- **Objectif**: Rythme plus naturel et réaliste

### 🐌 Phase 3: Rythme lent (30-60 secondes)
- **Incréments**: 1 unité
- **Fréquence**: Toutes les 10-12 secondes
- **Objectif**: Simulation d'une activité normale

### 🎆 Phase 4: Bursts périodiques (60-120 secondes)
- **Incréments**: 5-20 unités (bursts 30% du temps) ou 1 unité
- **Fréquence**: Toutes les 10-15 secondes
- **Objectif**: Pics d'activité imprévisibles

### ⏰ Phase 5: Incrémentation régulière (Après 2 minutes)
- **Incréments**: 1-3 unités
- **Fréquence**: Exactement toutes les 2 minutes
- **Objectif**: Maintenir une activité constante à long terme

### 🔄 Cycle complet
- **Durée totale**: 4 minutes (2min phases 1-4 + 2min phase 5)
- **Redémarrage**: Retour automatique à la phase 1
- **Persistance**: Chaque incrémentation est sauvegardée en base de données

### Synchronisation base de données
- Chaque incrémentation est persistée en base
- Synchronisation automatique toutes les 30 secondes
- Fonction PostgreSQL atomique pour éviter les conflits

## 🧪 Tests

Tester l'API du compteur :
```bash
npm run test:counter
```

## 📡 API Endpoints

### GET /api/counter
Récupère la valeur actuelle du compteur
```json
{
  "success": true,
  "value": 12345
}
```

### POST /api/counter
Incrémente le compteur
```json
{
  "increment": 5
}
```

### PUT /api/counter  
Met à jour la valeur du compteur
```json
{
  "value": 12345
}
```

### GET /api/stats
Récupère les statistiques des paiements
```json
{
  "totalPayments": 42,
  "payments": [...]
}
```

- 🌍 **Sphère 3D interactive** : Visualisation de la Terre avec rotation automatique et contrôles manuels
- 💳 **Paiements Stripe** : Intégration complète avec webhooks pour traitement automatique
- 📍 **Géolocalisation** : Détection automatique de la position de l'utilisateur
- 🗄️ **Base de données Supabase** : Stockage des paiements avec géolocalisation
- 📊 **Statistiques en temps réel** : Compteur de personnes ayant confirmé leur existence

## Architecture

### Frontend
- **Next.js 14** avec App Router
- **React Three Fiber** pour la sphère 3D
- **Tailwind CSS** pour le styling
- **TypeScript** pour la sécurité des types

### Backend
- **API Routes Next.js** pour les endpoints
- **Webhooks Stripe** pour capturer les paiements
- **Supabase** pour la base de données PostgreSQL

### Services externes
- **Stripe** pour les paiements
- **BigDataCloud API** pour le reverse geocoding (gratuit)

## Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer Supabase :**
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Exécuter le script SQL dans `supabase/migrations/001_create_payments_table.sql`
   - Mettre à jour les variables Supabase dans `.env`

3. **Configurer Stripe :**
   - Créer un compte sur [stripe.com](https://stripe.com)
   - Configurer un webhook pointant vers `https://votre-domaine.com/api/webhook`
   - Ajouter le secret webhook dans `.env`

4. **Démarrer le serveur de développement :**
```bash
npm run dev
```

## Configuration des webhooks Stripe

1. Dans le dashboard Stripe, aller dans **Développeurs > Webhooks**
2. Créer un nouveau webhook avec l'URL : `https://votre-domaine.com/api/webhook`
3. Sélectionner l'événement : `checkout.session.completed`
4. Copier le secret du webhook dans la variable `STRIPE_WEBHOOK_SECRET`

## Utilisation

1. L'utilisateur arrive sur la page et voit la sphère terrestre
2. Le navigateur demande l'autorisation de géolocalisation
3. L'utilisateur clique sur "Je confirme mon existence"
4. Redirection vers Stripe avec les métadonnées de localisation
5. Après paiement, webhook traite automatiquement l'événement
6. Le compteur s'incrémente et la localisation apparaît sur la sphère