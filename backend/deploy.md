# 🚀 Guide de Déploiement Swapeo Backend

## ⚡ Déploiement Rapide (5 minutes)

### Option 1: Railway (Recommandé)

```bash
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Déployer
railway deploy

# 4. Récupérer l'URL
railway domain
```

### Option 2: Vercel

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer
vercel --prod

# 3. Configuration
# - Framework: Other
# - Build Command: npm run build (laissez vide)
# - Output Directory: . (laissez vide)
```

### Option 3: Heroku

```bash
# 1. Créer l'app
heroku create swapeo-backend-[votre-nom]

# 2. Configurer les variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret-key

# 3. Déployer
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## 🔧 Configuration Production

### Variables d'environnement obligatoires

```bash
NODE_ENV=production
JWT_SECRET=votre-secret-production-super-securise
FRONTEND_URL=https://votre-frontend.vercel.app
```

### Variables optionnelles

```bash
PORT=3001
MAX_FILE_SIZE=10485760
RATE_LIMIT_MAX_REQUESTS=200
```

## 🌐 Connexion Frontend-Backend

### 1. Mettre à jour le frontend

Dans votre projet frontend, créez un fichier `.env`:

```bash
VITE_API_URL=https://votre-backend.railway.app
```

### 2. Mettre à jour les appels API

Le frontend utilisera automatiquement cette URL pour toutes les requêtes API.

## 🧪 Test de Déploiement

### 1. Vérifier le health check

```bash
curl https://votre-backend.railway.app/health
```

### 2. Tester l'authentification

```bash
curl -X POST https://votre-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 3. Tester avec le frontend

1. Ouvrir votre frontend déployé
2. Aller sur `/login`
3. Se connecter avec `john@example.com` / `password123`
4. Naviguer vers `/dashboard`

## 🔗 URLs Complètes

Une fois déployé, vous aurez :

- **Backend API**: `https://votre-backend.railway.app`
- **Frontend**: `https://votre-frontend.vercel.app`
- **Documentation API**: `https://votre-backend.railway.app/`

## 🛠 Commandes de Maintenance

### Redémarrer le serveur

```bash
# Railway
railway restart

# Heroku
heroku restart

# Vercel
vercel --prod (redéploiement)
```

### Voir les logs

```bash
# Railway
railway logs

# Heroku
heroku logs --tail

# Vercel
vercel logs
```

## 🔍 Monitoring

### Endpoints de surveillance

- Health: `GET /health`
- Stats: `GET /api/admin/health` (nécessite token admin)
- Métriques: Logs automatiques avec Morgan

### Alertes recommandées

- Réponse health check > 5s
- Erreurs 5xx > 1%
- CPU > 80%
- Mémoire > 90%

## 🚀 Optimisations Production

### 1. Compression

Le serveur utilise déjà Helmet pour la sécurité.

### 2. Cache

Fichiers statiques cachés automatiquement.

### 3. Rate Limiting

Configuré pour 100 req/15min par IP.

### 4. Monitoring

Logs structurés avec Morgan.

---

## 📞 Support Déploiement

En cas de problème :

1. **Vérifier les logs** du service de déploiement
2. **Tester en local** avec `npm run dev`
3. **Vérifier les variables d'environnement**
4. **Contrôler la connectivité** frontend ↔ backend

**🎉 Votre API Swapeo est maintenant en ligne !**
