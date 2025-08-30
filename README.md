# Pay To Exist

Application web permettant aux utilisateurs de "confirmer leur existence" en effectuant un paiement via Stripe. L'application affiche une sphère 3D interactive représentant la Terre avec les localisations des paiements.

## Fonctionnalités

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